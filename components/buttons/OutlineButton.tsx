import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
  onPress?: Function
  label: string
  borderColor?: string
  color?: string
  loading?: boolean
  width?: string | number | undefined
  pVertical?: string | number | undefined
}

const OutlineButton = ({
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
        borderRadius: 8,
        width: width ?? '100%',
        borderColor: borderColor ?? '#387E1B',
        borderWidth: 1,
        alignItems: 'center',
        paddingVertical: pVertical ?? 12,
      }}
      onPress={() => onPress && onPress()}
      disabled={!onPress}>
      <Text
        style={{
          color: color ?? '#387E1B',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default OutlineButton
