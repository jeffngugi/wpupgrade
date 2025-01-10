import { Box, Divider, HStack, Text } from 'native-base'
import React from 'react'

type Props = {
  label: string
  value: string
}

const DocItem = ({ label, value }: Props) => {
  return (
    <Box>
      <HStack alignItems="center" justifyContent="space-between" my="16px">
        <Text color="grey" fontSize={'14px'}>
          {label}
        </Text>
        <Text color={'charcoal'} fontSize={'16px'}>
          {value}
        </Text>
      </HStack>
      <Divider />
    </Box>
  )
}

export default DocItem
