import React from 'react'
import { HStack, Text } from 'native-base'

const PayslipItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <HStack justifyContent="space-between" paddingY="10px" marginX="20px">
      <Text fontSize="16px" color={'grey'}>
        {label}
      </Text>
      <Text fontSize="16px" color="charcoal">
        {value}
      </Text>
    </HStack>
  )
}

export default PayslipItem
