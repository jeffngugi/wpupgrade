import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import notifee from '@notifee/react-native'
import { useFetchNotificationsInfinite } from '~api/notifications'
import { useMyProfile } from '~api/account'
import { RECORDS_PER_PAGE } from '~constants/comon'
import NotificationListing from './containers/NotificationListing'

const Notification = ({ navigation }: { navigation: any }) => {
  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    })

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    })
  }
  const profileQuery = useMyProfile()
  const profileData = profileQuery.data?.data
  const employeeId = profileData?.id

  const params = {
    employee_id: employeeId,
    recordsPerPage: RECORDS_PER_PAGE,
    package_name: 'com.workpay.workpay',
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
    isRefetching,
  } = useFetchNotificationsInfinite(params as any)

  const notificationsList = React.useMemo(
    () => data?.pages?.flatMap(page => page?.data?.data || []),
    [data?.pages],
  )
  return (
    <ScreenContainer px="0px">
      <Box px="16px" mb={'24px'}>
        <ScreenHeader
          title="Notifications"
          onPress={() => navigation.goBack()}
        />
      </Box>
      {/* <Button onPress={() => onDisplayNotification()}>Sas</Button> */}
      <NotificationListing
        data={notificationsList || []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        isRefetching={isRefetching}
      />
    </ScreenContainer>
  )
}

export default Notification
