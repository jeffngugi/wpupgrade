import { Box, Image, Pressable, Text } from 'native-base'
import React from 'react'
const img = require('~assets/images/grant.png')

const GrantAccess = () => {
  //   const
  return (
    <Box flex={1} alignItems="center">
      <Image source={img} mt="106px" alt="grant" />
      <Text
        fontSize="18px"
        color="charcoal"
        fontFamily="heading"
        lineHeight="30px">
        Grant access to your contacts
      </Text>
      <Text textAlign="center" fontSize="16px" lineHeight="24px" marginX="24px">
        We use your contacts to help you send faster to other wallet users
      </Text>
      <Pressable
        marginTop="24px"
        backgroundColor="green.20"
        paddingY="14px"
        borderRadius="32px"
        paddingX="24px">
        <Text lineHeight="26px" fontFamily="heading" fontSize="16px">
          Grant Access
        </Text>
      </Pressable>
    </Box>
  )
}

export default GrantAccess
