import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import PlusIcon from '~assets/svg/plus-green.svg'

type Props = {
  onPress?: Function
  label: string
  borderColor?: string
  color?: string
  loading?: boolean
  width?: string | number | undefined
  pVertical?: string | number | undefined
}

const OutlineButtonIcon = ({
  width,
  onPress,
  label,
  borderColor,
  color,
  loading,
  pVertical,
}: Props) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 4,
        width: width ?? '100%',
        borderColor: borderColor ?? '#387E1B',
        borderWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: pVertical ?? 12,
      }}
      onPress={() => onPress && onPress()}
      disabled={!onPress}>
      <PlusIcon />

      <Text
        style={{
          color: color ?? '#387E1B',
          fontSize: 16,
          paddingLeft: 8,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default OutlineButtonIcon
