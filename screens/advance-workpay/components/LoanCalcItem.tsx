import React from 'react'
import { HStack, Text } from 'native-base'
import { SvgProps } from 'react-native-svg'

const LoanCalcItem = ({
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
      <HStack>
        <Icon color="#3E8BEF" width={20} height={20} />
        <Text ml="8px" fontSize={'14px'} color={'grey'}>
          {label}:{' '}
        </Text>
      </HStack>
      <Text fontSize="16px" color="charcoal" fontFamily={'heading'}>
        {value}
      </Text>
    </HStack>
  )
}

export default LoanCalcItem
