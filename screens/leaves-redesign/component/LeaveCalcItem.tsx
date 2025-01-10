import React from 'react'
import { HStack, Text } from 'native-base'
import { SvgProps } from 'react-native-svg'

const LeaveCalcItem = ({
  label,
  value,
  NoSpace,
  Icon,
}: {
  label: string
  value: string
  Icon: React.FC<SvgProps>
  NoSpace?: boolean
}) => {
  return (
    <HStack
      my="10px"
      justifyContent={NoSpace ? 'flex-start' : 'space-between'}
      alignItems={'center'}>
      <HStack  >
        <Icon color="#3E8BEF" width={24} height={24} />
        <Text ml="8px" fontSize={'14px'} color={'charcoal'} >
          {label} {' '}
        </Text>

        {value ? <Text fontSize="14px" color="green.70" fontFamily={'heading'}>
          {value} days
        </Text> : null}
      </HStack>
    </HStack>
  )
}

export default LeaveCalcItem
