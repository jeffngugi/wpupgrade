import { StyleSheet, Animated, View, Dimensions } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('screen')

type Props = {
  data: unknown[]
  scrollX: Animated.Value
  index: number
}

const Dots = ({ data, scrollX, index }: Props) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width]

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [6, 15, 6],
          extrapolate: 'clamp',
        })

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#D9D9D9', '#62A446', '#D9D9D9'],
          extrapolate: 'clamp',
        })

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              { width: dotWidth, backgroundColor },
              idx === index && styles.dotActive,
            ]}
          />
        )
      })}
    </View>
  )
}

export default Dots

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: '#D9D9D9',
  },
  dotActive: {
    backgroundColor: '#62A446',
  },
})
