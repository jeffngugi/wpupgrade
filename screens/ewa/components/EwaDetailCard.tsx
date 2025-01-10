import { capitalize } from 'lodash'
import { Badge, Box, Divider, HStack, Text } from 'native-base'
import React from 'react'
import { useEwaStatusColor } from '~utils/hooks/useEwaStatusColor'

type Props = {
  label: 'Status' | 'Recipient' | 'Reference' | 'Date'
  value: string
}
const EwaDetailCard = ({ label, value }: Props) => {
  return (
    <Box>
      <Divider />
      <HStack justifyContent="space-between" marginX="16px" marginY="20px">
        <Text color="charcoal" fontSize="16px">
          {label}
        </Text>
        {label === 'Status' ? (
          <Badge backgroundColor={useEwaStatusColor(value)}>
            {capitalize(value)}
          </Badge>
        ) : (
          <Text color="charcoal" fontSize="16px">
            {value}
          </Text>
        )}
      </HStack>
    </Box>
  )
}

export default EwaDetailCard
