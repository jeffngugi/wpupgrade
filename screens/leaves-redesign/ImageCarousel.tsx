import React, { FC, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import SickIcon from '~assets/svg/sick-leave.svg'
import AnnualIcon from '~assets/svg/annual-leave.svg'
import CompasionateIcon from '~assets/svg/compasionate.svg'
import MaternityIcon from '~assets/svg/maternity.svg'
import StudyIcon from '~assets/svg/study-leave.svg'
import ModuleHeroLeaveCard from '~components/ModuleHeroLeaveCard'
import { Box } from 'native-base'
import { analyticsTrackEvent } from '~utils/analytics'
import { Leaves } from '~utils/analytics/events/leaves'
import { AnalyticsEvents } from '~utils/analytics/events'
import { TLeaveItem } from './types'
import { toString } from 'lodash'

const { width } = Dimensions.get('window')

const LEAVE_TYPES = {
  ANNUAL: 'Annual Leave',
  COMPASSIONATE: 'Compassionate Leave',
  SICK: 'Sick Leave',
  MATERNITY: 'Maternity Leave',
  PATERNITY: 'Paternity',
  STUDY: 'Study Leave',
}

const SPACING = 2
const ITEM_LENGTH = width * 0.9 // Item is a square. Therefore, its height and width are of the same length.
const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 5
const BORDER_RADIUS = 20
const CURRENT_ITEM_TRANSLATE_Y = 10

interface ImageCarouselItem {
  id: number
  uri?: string
  title?: string
}

interface ImageCarouselProps {
  data: ImageCarouselItem extends TLeaveItem ? TLeaveItem[] : ImageCarouselItem[]
}

const ImageCarousel: FC<ImageCarouselProps> = ({ data }) => {
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(1)
  const scrollX = useRef(new Animated.Value(0)).current
  const [dataWithPlaceholders, setDataWithPlaceholders] = useState<
    ImageCarouselItem[]
  >([])
  const currentIndex = useRef<number>(0)
  const flatListRef = useRef<FlatList<any>>(null)
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false)
  const [isPrevDisabled, setIsPrevDisabled] = useState<boolean>(false)

  useEffect(() => {
    setDataWithPlaceholders([{ id: -1 }, ...data, { id: data.length }])
    currentIndex.current = 1
    setIsPrevDisabled(true)
  }, [data])

  const onViewableItemsChanged = ({ viewableItems }) => {
    currentIndex.current = viewableItems[0].index
    setCurrentStateIndex(currentIndex.current)
    analyticsTrackEvent(AnalyticsEvents.Leaves.swipe_leave_card, {
      currentIndex: currentIndex.current,
    })
  }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }])

  const handleOnPrev = () => {
    if (currentIndex.current === 1) {
      return
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex.current - 1,
      })
    }
  }

  const handleOnNext = (index: number) => {
    if (currentIndex.current === data.length) {
      return
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: index + 1,
      })
      setCurrentStateIndex(index + 1)
    }
  }

  // `data` perameter is not used. Therefore, it is annotated with the `any` type to merely satisfy the linter.
  const getItemLayout = (_data: any, index: number) => ({
    length: ITEM_LENGTH,
    offset: ITEM_LENGTH * (index - 1),
    index,
  })

  const renderCarouselItem = ({ item, index }) => {
    if (!item.leave_name) {
      return <View style={{ width: EMPTY_ITEM_LENGTH }} />
    }

    const policy = item.leave_name ?? ''
    const balance = item.balance_days ?? ''
    let Icon = AnnualIcon
    let color1 = 'rgba(255, 255, 255, 0.5)'
    let color2 = 'rgba(214,241,202, 0.5)'

    switch (policy) {
      case LEAVE_TYPES.ANNUAL:
        Icon = AnnualIcon
        color1 = 'rgba(255, 255, 255, 0.5)'
        color2 = 'rgba(214,241,202, 0.5)'
        break
      case LEAVE_TYPES.COMPASSIONATE:
        Icon = CompasionateIcon
        color1 = 'rgba(240,245,237, 0.5)'
        color2 = 'rgba(240,219,220, 0.5)'
        break
      case LEAVE_TYPES.SICK:
        Icon = SickIcon
        color1 = 'rgba(242,243,243, 0.5)'
        color2 = 'rgba(248,223,175, 0.5)'
        break
      case LEAVE_TYPES.MATERNITY:
      case LEAVE_TYPES.PATERNITY:
        Icon = MaternityIcon
        color1 = 'rgba(240,245,237, 0.5)'
        color2 = 'rgba(177,200,231, 0.5)'
        break
      case LEAVE_TYPES.STUDY:
        Icon = StudyIcon
        color1 = 'rgba(242,243,243, 0.5)'
        color2 = 'rgba(204,224,252, 0.5)'
        break
    }

    return (
      <Box>
        <ModuleHeroLeaveCard
          label={`${policy} balance`}
          value={`${balance} days`}
          color1={color1}
          color2={color2}
          Icon={Icon}
        />
      </Box>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dataWithPlaceholders}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={renderCarouselItem}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => toString(item?.id)}
        bounces={false}
        decelerationRate={0}
        renderToHardwareTextureAndroid
        contentContainerStyle={styles.flatListContent}
        snapToInterval={ITEM_LENGTH}
        snapToAlignment="start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />
      <View style={styles.footer}>
        {data.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handleOnNext(index)}
            disabled={isNextDisabled}
            style={({ pressed }) => [
              {
                opacity: pressed || isNextDisabled ? 0.5 : 1.0,
              },
              styles.arrowBtn,
            ]}>
            <Box
              width="8px"
              height="8px"
              borderRadius="4px"
              mx="4px"
              backgroundColor={
                currentStateIndex === index + 1 ? 'green.50' : '#D9D9D9'
              }
            />
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default ImageCarousel

const styles = StyleSheet.create({
  container: {},
  arrowBtn: {},
  arrowBtnText: {
    fontSize: 42,
    fontWeight: '600',
  },
  footer: {
    // backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  flatListContent: {
    height: CURRENT_ITEM_TRANSLATE_Y * 2 + ITEM_LENGTH / 2.5,
    // alignItems: 'center',
    marginBottom: 0,
  },
  item: {},
  itemContent: {
    marginHorizontal: SPACING * 3,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS + SPACING * 2,
  },
  itemText: {
    fontSize: 24,
    position: 'absolute',
    bottom: SPACING * 2,
    right: SPACING * 2,
    color: 'white',
    fontWeight: '600',
  },
  itemImage: {
    width: '100%',
    height: ITEM_LENGTH,
    borderRadius: BORDER_RADIUS,
    resizeMode: 'cover',
  },
})
