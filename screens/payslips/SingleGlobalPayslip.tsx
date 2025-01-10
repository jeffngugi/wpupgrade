import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview'
import { Box } from 'native-base'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import base64 from 'react-native-base64'

const SingleGlobalPayslip = ({ payslip }: { payslip: unknown }) => {
  const htmlFile = base64.decode(payslip)
  return (
    <Box flex={1}>
      <WebView
        originWhitelist={['*']}
        style={{
          flex: 1,
          height: Dimensions.get('window').height,
        }}
        javaScriptEnabled={true}
        source={{ html: htmlFile }}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode={'always'}
        // ref={webviewRef}
      />
    </Box>
  )
}

export default SingleGlobalPayslip

const styles = StyleSheet.create({})
