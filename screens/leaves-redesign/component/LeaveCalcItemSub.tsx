import React from 'react'
import { HStack, Text, Box } from 'native-base'

const LeaveCalcItemSub = ({
  label,
  value,
  NoSpace,
}: {
  label: string
  value: string
  NoSpace?: boolean
}) => {
  return (
    <HStack
      justifyContent={NoSpace ? 'flex-start' : 'space-between'}
      alignItems={'center'}>
      <HStack>
        <Box w='24px' h='24px' />
        <Text ml="8px" fontSize={'12px'} color={'grey'}>
          {label}{' '}
        </Text>
        <Text fontSize="12px" color="sea.50" fontFamily={'heading'}>
          {value}
        </Text>
      </HStack>

    </HStack>
  )
}

export default LeaveCalcItemSub
