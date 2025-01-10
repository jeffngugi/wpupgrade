import { Pressable } from 'native-base'
import React from 'react'
import PlusIcon from '../assets/svg/plus.svg'

type Props = {
  onPress: () => void
}

const FloatingBtn = ({ onPress }: Props) => {
  return (
    <Pressable
      backgroundColor="green.50"
      borderRadius="12px"
      padding="21px"
      position="absolute"
      bottom="56px"
      right="1px"
      onPress={onPress}>
      <PlusIcon color="white" />
    </Pressable>
  )
}

export default FloatingBtn
