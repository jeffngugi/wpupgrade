import React from 'react'
import { Box, HStack, Text, Pressable } from 'native-base'
import CrashIcon from '~assets/svg/crash-icon.svg'
import { navigateToURI } from '~utils/linking'

const ErrorFallbackUi = () => {
  return (
    <Box safeArea flex={1} py="30px" px={'16px'}>
      <Box flex={1} marginTop="60px" alignItems="center">
        <CrashIcon />
        <Text fontSize="20px" color="charcoal" marginY="10px">
          Connection Failed
        </Text>
        <Text fontSize="16px" textAlign="center">
          Try restarting workpay. There might be a problem with your connection.
        </Text>
      </Box>
      <HStack alignItems={'center'} justifyContent="center" mb="10px">
        <Pressable
          onPress={() => navigateToURI('https://www.myworkpay.com/support')}>
          <Text textAlign="center" mb="10px" color="sea.50" fontSize="16px">
            support team
          </Text>
        </Pressable>
        <Text textAlign="center" ml="5px" mb="10px" fontSize="16px">
          for more help.
        </Text>
      </HStack>
    </Box>
  )
}

export default ErrorFallbackUi
