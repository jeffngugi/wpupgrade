import { Linking } from 'react-native'
import { isIos } from './platforms'
import DeviceInfo from 'react-native-device-info'

export const navigateToURI = (uri: string, backupUri?: string) => {
  Linking.openURL(uri).catch(reason => {
    if (backupUri) {
      navigateToURI(backupUri)
    } else {
      console.log('Url not supported', reason)
    }
  })
}

export const openStorePage = () => {
  if (isIos) {
    navigateToURI('https://apps.apple.com/app/id1544400326')
  } else {
    navigateToURI(`market://details?id=${DeviceInfo.getBundleId()}`)
  }
}
