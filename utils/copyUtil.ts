import Clipboard from '@react-native-clipboard/clipboard'
import { Toast } from 'native-base'

const copyToClipboard = (
  text: string,
  toastMessage = 'Copied to clipboard!',
): void => {
  Clipboard.setString(text)
  Toast.show({
    title: toastMessage,
    placement: 'bottom',
  })
}

export default copyToClipboard
