import React from 'react'
import { Box, HStack, Text, Divider } from 'native-base'

type DetailItemProps = {
  label: string
  value: string | number
  valueColor?: string
}

const DetailItem = ({ label, value, valueColor }: DetailItemProps) => {
  return (
    <Box>
      <HStack justifyContent="space-between" py="20px" alignItems="center">
        <Text fontSize={'14px'} color={'grey'}>
          {label}
        </Text>
        <Text fontSize="16px" color={valueColor || 'charcoal'}>
          {value}
        </Text>
      </HStack>
      <Divider />
    </Box>
  )
}

export default DetailItem
