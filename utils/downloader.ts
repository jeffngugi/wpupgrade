import { noop } from 'lodash'
import { Platform } from 'react-native'
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util'
import Share from 'react-native-share'

const pdfDownloader = (url: string, fileName: string) => {
  const {
    dirs: { DownloadDir, DocumentDir },
  } = ReactNativeBlobUtil.fs
  const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir })
  const fPath = aPath + '/' + fileName + '.pdf'
  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: fPath,
      notification: true,
    },

    android: {
      fileCache: true,
      appendExt: 'pdf',
      path: aPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        mime: 'application/pdf',
      },
    },
  })

  ReactNativeBlobUtil.config(configOptions as ReactNativeBlobUtilConfig)
    .fetch('GET', url)
    .then(res => {
      if (Platform.OS === 'ios') {
        const filePath = res.path()
        const options = {
          type: 'application/pdf',
          url: filePath,
          saveToFiles: true,
        }
        Share.open(options)
          .then(resp => noop())
          .catch(err => noop())
      }
    })
    .catch(err => noop())
}

export { pdfDownloader }
