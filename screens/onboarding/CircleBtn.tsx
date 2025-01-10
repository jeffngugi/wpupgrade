import {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import React, { ReactNode } from 'react'

type Props = {
  style?: StyleProp<ViewStyle>
  size: number
  color?: ColorValue
  children: ReactNode
  onPress?: ((event: GestureResponderEvent) => void) | undefined
}

const CircleBtn = ({ style, size, color, children, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: color ?? 'white',
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {children}
    </TouchableOpacity>
  )
}

export default CircleBtn
