import React from 'react'
import ScreenContainer from './ScreenContainer'
import CrashIcon from '~assets/svg/crash-icon.svg'
import { Text, Box, Pressable, HStack } from 'native-base'
import { navigateToURI } from '~utils/linking'
import ClockInOutBtns from '~screens/home/ClockInOutBtns'

const NoInternetScreen = () => {
  return (
    <ScreenContainer>
      <Box flex={1}>
        <Box alignItems="center" textAlign="center" mt="30%" mb="30px">
          <CrashIcon />
          <Text mt="32px" color="charcoal" fontSize={24} mb="10px">
            Connection failed
          </Text>
          <Text textAlign="center" fontSize={16}>
            Try restarting Workpay. There might be a problem with your internet
            connection
          </Text>
        </Box>
        <Box mx="16px">
          <ClockInOutBtns />
        </Box>
      </Box>

      <Text textAlign="center" mb="10px" alignItems={'center'} fontSize="16px">
        If you still can&apos;t connect, please contact our
      </Text>
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
    </ScreenContainer>
  )
}

export default NoInternetScreen
