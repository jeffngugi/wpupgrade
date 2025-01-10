import React from 'react'
import { Box, HStack, Heading, Pressable, Text } from 'native-base'
import ArrowIcon from '~assets/svg/arrow.svg'

const WalletMore = () => {
  return (
    <Box>
      <Heading fontSize="16px" color="#253545" marginBottom="24px">
        Get more from Workpay
      </Heading>
      <Pressable padding="16px" borderRadius="8px" backgroundColor="green.20">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading lineHeight="30px" fontSize="20px">
            Your Money, Your Wallet
          </Heading>
          <ArrowIcon width={20} height={20} color="#536171" />
        </HStack>
        <Box width="75%" marginTop="8px">
          <Text lineHeight="22px">
            Use your Workpay card to make transactions anywhere in the world
            today{' '}
            Use your Workpay wallet to send money and pay merchants seamlessly anytime, anywhere.{' '}
          </Text>
        </Box>
      </Pressable>
    </Box>
  )
}

export default WalletMore
