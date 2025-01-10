import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import GridIcon from '../assets/svg/grid-icon.svg'
import ListIcon from '../assets/svg/list-icon.svg'
import { Pressable } from 'native-base'

type Props = {
  gridView: boolean
  onPress: () => void
}

const GridListBtn = ({ gridView, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} justifyContent={'center'}>
      {gridView ? (
        <ListIcon color="#536171" width={24} height={24} />
      ) : (
        <GridIcon color="#536171" width={24} height={24} />
      )}
    </Pressable>
  )
}

export default GridListBtn
