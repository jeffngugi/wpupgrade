import { useNavigation } from '@react-navigation/native'
import { Badge, Box, Divider, HStack, Pressable, Text } from 'native-base'
import React from 'react'
import { LoanRoutes } from '~types'

const LoanItem = () => {
  const navigation = useNavigation()
  return (
    <Pressable onPress={() => navigation.navigate(LoanRoutes.Detail)} pt="10px">
      <HStack justifyContent="space-between" my="20px">
        <Box>
          <Text fontSize="20px" color="charcoal" fontFamily="mono">
            20,000 KES
          </Text>
          <HStack my="4px" alignItems="center">
            <Text color="charcoal" fontSize="16px">
              Staff loan
            </Text>
            <Box
              width="4px"
              height="4px"
              borderRadius="2px"
              bgColor="charcoal"
              mx="3px"
            />
            <Text fontSize="16px">6 Months</Text>
          </HStack>
          <Text fontSize="14px">April 18th</Text>
        </Box>
        <Badge>Active</Badge>
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default LoanItem
