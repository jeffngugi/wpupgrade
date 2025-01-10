import React from 'react'
import { Pressable, Text } from 'native-base'
import ChevDown from '~assets/svg/chev-down.svg'

type Props = {
  label: string
  onPress: () => void
}

const MonthYearBtn = ({ label, onPress }: Props) => {
  return (
    <Pressable
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      alignSelf="flex-start"
      borderWidth="1px"
      paddingX="14px"
      borderColor="navy.10"
      borderRadius="4px"
      paddingY="6px"
      onPress={onPress}>
      <Text fontSize="14px" color={'grey'} mr={'4px'} ml={'2px'}>
        {label}
      </Text>
      <ChevDown color="#536171" width={20} height={20} />
    </Pressable>
  )
}

export default MonthYearBtn
