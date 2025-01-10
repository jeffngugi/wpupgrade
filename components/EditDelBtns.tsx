import React from 'react'
import EditIcon from '~assets/svg/edit.svg'
import DelIcon from '~assets/svg/delete.svg'
import { HStack, Pressable } from 'native-base'

type Props = {
  onPressEdit: () => void
  onPressDel: () => void
}
const EditDelBtns = ({ onPressDel, onPressEdit }: Props) => {
  return (
    <HStack>
      <Pressable onPress={onPressEdit} mx="20px">
        <EditIcon color="#253545" />
      </Pressable>
      <Pressable onPress={onPressDel}>
        <DelIcon color="#253545" />
      </Pressable>
    </HStack>
  )
}

export default EditDelBtns
