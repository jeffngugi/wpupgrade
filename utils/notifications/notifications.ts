import messaging from '@react-native-firebase/messaging'
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory,
} from '@notifee/react-native'
import { noop } from 'lodash'
import { PermissionsAndroid, Platform } from 'react-native'

export const getFcmToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages()
    const newFcmToken = await messaging().getToken()
    return newFcmToken
  } catch (error) {
    console.error(error)
    return null
  }
}

async function requestMessagingPermission() {
  await messaging().requestPermission()
}

async function requestPermissionAndroid() {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )
  } catch (err) {
    console.log(err)
  }
}

export const requestUserPermission = async () => {
  await notifee.requestPermission()
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      await requestPermissionAndroid()
    }
  } else {
    await requestMessagingPermission()
  }
}

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.debug(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    )
  })

  // Quiet and Background State -> Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        //The below block of code is to ensure we do not progress with notification display if its coming from workpay server
        if (remoteMessage?.data?.title) {
          return
        }
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        })

        await notifee.displayNotification({
          /**
           * The part of the commented code was used to display notifications from Workpay server.
           * Currently it does not work as expected, will be removed once the server is rectified
           */

          title: remoteMessage.notification?.title, // ?? remoteMessage.data?.title,
          body: remoteMessage.notification?.body, // ?? remoteMessage.data?.message,
          android: {
            channelId,
            smallIcon: 'ic_notification',
            pressAction: {
              id: 'default',
            },
            category: AndroidCategory.CALL,
            importance: AndroidImportance.HIGH,
            color: '#62A446',
          },
        })
      }
    })
    .catch(error => noop())

  // Foreground State
  messaging().onMessage(async remoteMessage => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    })
    if (remoteMessage?.data?.title) {
      return
    }
    await notifee.displayNotification({
      title: remoteMessage.notification?.title, //remoteMessage.data?.title,
      body: remoteMessage.notification?.body, //remoteMessage.data?.message,

      android: {
        channelId,
        smallIcon: 'ic_notification',
        pressAction: {
          id: 'default',
        },
        category: AndroidCategory.CALL,
        importance: AndroidImportance.HIGH,
        color: '#62A446',
      },
    })
  })
}
