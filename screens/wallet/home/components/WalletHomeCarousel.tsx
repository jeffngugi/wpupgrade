import React, { useRef, useState } from 'react'
import { Box } from 'native-base'
import { Animated } from 'react-native'
import WalletScrollItem from './WalletScrollItem'

const data = [
  {
    balance: '200000',
    type: 'Wallet',
  },
  {
    balance: '100000',
    type: 'Investment',
  },
  {
    balance: '50000',
    type: 'Loan',
  },
  {
    balance: '10000',
    type: 'Savings',
  },
]

const WalletHomeCarousel = () => {
  const [index, setIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event)
  }

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index)
  }).current

  const renderItem = ({ item, index }) => {
    return <WalletScrollItem />
  }

  const dataSlicedOneItem = data.slice(0, 1)
  return (
    <Box height={220} pl="5px">
      {/* <FlatList
        pl={index === 0 ? '0px' : 0}
        data={dataSlicedOneItem}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        onScroll={handleOnScroll}
        flex={1}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        ItemSeparatorComponent={() => <Box padding="20px" />}
      /> */}
      {renderItem({ item: dataSlicedOneItem[0], index: 0 })}
      {/* <Dots data={data} scrollX={scrollX} index={index} /> */}
    </Box>
  )
}

export default WalletHomeCarousel
