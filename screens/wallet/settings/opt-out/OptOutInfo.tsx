import React from 'react'
import { Box, HStack, Heading, Text } from 'native-base'
import WarningIcon from '~assets/svg/wallet-alert.svg'

const OptOutInfo = () => {
  return (
    <Box
      backgroundColor="chrome.10"
      borderWidth="1px"
      borderRadius="4px"
      borderColor="chrome.70"
      paddingY="16px"
      paddingRight="40px"
      paddingLeft="16px">
      <HStack>
        <Box>
          <WarningIcon />
        </Box>
        <Box ml="10px">
          <Heading fontSize="16px">Extra Information before opting out</Heading>
          <Text mt="10px" color="charcoal">
            Disabling your wallet will limit access to features like
            sending/receiving money, making payments, and expense tracking. This
            action is irreversible. If you decide to use the wallet again in the
            future, you will need to re-register and go through the entire setup
            process. Opt out only if you're absolutely certain you won't need
            these features and understand the need to re-register later.
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

export default OptOutInfo
