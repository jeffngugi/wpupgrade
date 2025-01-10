import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import { Text } from '../components/Themed'

type Props = {
  title: string
  accessibilityLabel?: string
  onPress: () => void
}

const Button: React.FC<Props> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#62A446',
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    height: 56,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    height: 20,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
})

export default Button
