import { StyleSheet, View } from 'react-native'
import React from 'react'

interface DotProps {
  index: number
  currentPage: number
}

const Dot: React.FC<DotProps> = ({ index, currentPage }) => {
  currentPage === index
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: currentPage === index ? '#62A446' : '#D1D0D0' },
      ]}
    />
  )
}

export default Dot

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 6,
    borderRadius: 8 / 2,
    justifyContent: 'center',
  },
})
