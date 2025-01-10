import React from 'react'
import { Box, HStack, Heading, VStack, Text, Pressable } from 'native-base'
import XIcon from '~assets/svg/x.svg'
import { useNavigation } from '@react-navigation/native'

const OptOutHeader = () => {
  const navigation = useNavigation()
  return (
    <Box marginBottom="24px" marginTop={'16px'}>
      <HStack>
        <VStack mr={'auto'} justifyContent="space-between">
          <Heading fontSize="24px" color={'charcoal'}>
            Opt out of Wallet
          </Heading>
          <Text fontSize="16px" color={'grey'}>
            You are about to opt out of Wallets
          </Text>
        </VStack>
        <Pressable onPress={() => navigation.goBack()}>
          <XIcon width={24} height={24} color="#253545" />
        </Pressable>
      </HStack>
    </Box>
  )
}

export default OptOutHeader
