import React from 'react'
import { Pressable, Text } from 'native-base'
import ChevDown from '~assets/svg/chev-down.svg'

type Props = {
  label: string
  onPress: () => void
}

const ActionSheetBtn = ({ label, onPress }: Props) => {
  return (
    <Pressable
      height={'30px'}
      alignItems="center"
      flexDirection="row"
      background="#F4F7FA"
      alignSelf="flex-start"
      borderWidth="1px"
      paddingX="5px"
      borderColor="navy.10"
      borderRadius="30px"
      onPress={onPress}>
      <Text fontSize="16px" color={'grey'} mr={'4px'} ml={'2px'}>
        {label}
      </Text>
      <ChevDown color="#536171" width={24} height={24} />
    </Pressable>
  )
}

export default ActionSheetBtn
