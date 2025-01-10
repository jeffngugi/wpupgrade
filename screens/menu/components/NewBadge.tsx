import React from 'react'
import { Badge, Text } from 'native-base'

export default function NewBadge() {
  return (
    <Badge variant="pending" py="0px" px="11px" marginBottom={0}>
      <Text color="white" marginY={0} fontSize="12px">
        New
      </Text>
    </Badge>
  )
}
