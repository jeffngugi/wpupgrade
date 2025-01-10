import React from 'react'
import { Box } from 'native-base'
import LottieView from 'lottie-react-native'

import logo from '~/assets/lotties/logo-chrome.json'

const LoaderScreen = () => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      flex={1}
      backgroundColor="white">
      <LottieView source={logo} autoPlay loop style={{ width: '60%' }} />
    </Box>
  )
}

export default LoaderScreen
