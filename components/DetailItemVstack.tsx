import React from 'react'
import { Box, HStack, Text, Divider, VStack } from 'native-base'

type DetailItemProps = {
  label: string
  value: string
  valueColor?: string
}

const DetailItemVstack = ({ label, value, valueColor }: DetailItemProps) => {
  return (
    <Box>
      <VStack py="20px" >
        <Text fontSize={'16px'} color={'grey'}>
          {label}
        </Text>
        <Text fontSize="16px" fontFamily={'heading'} color={valueColor || '#253545'} mt={'8px'}>
          {value}
        </Text>
      </VStack>
      <Divider />
    </Box>
  )
}

export default DetailItemVstack
