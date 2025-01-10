import React, { useCallback, useRef, useState } from 'react'
import { Box, HStack, VStack, Text, Image, Pressable } from 'native-base'
import Vase from '~assets/svg/flowervase.svg'
import Img from '~assets/images/Payday.jpg'
import { useTasks } from '~api/home'
import { isArray, isEmpty } from 'lodash'
import { windowWidth } from '~utils/appConstants'
import { StyleSheet, FlatList, View } from 'react-native'
import { navigateToURI } from '~utils/linking'
import { isFeatureEnabled } from '~utils/hooks/useMenuItems'
import { useEnabledFeatures } from '~api/settings'
import { useNavigation } from '@react-navigation/native'
import { EwaRoutes } from '~types'

export type TTask = {
  action: string
  category: string
  description: string
  record_id: null
  title: string
}

const WelcomeCard = () => {
  const { data } = useTasks()
  const currentIndex = useRef<number>(0)
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(1)
  const flatListRef = useRef<FlatList<any>>(null)
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(false)
  const [isPrevDisabled, setIsPrevDisabled] = useState<boolean>(false)
  const { data: enabledFeaturesData } = useEnabledFeatures()
  const navigation = useNavigation()

  const enabledFeatures = enabledFeaturesData?.data?.data ?? []

  const ewaEnabled = isFeatureEnabled('ewa', enabledFeatures)

  const handleOnViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      // const itemsInView = viewableItems.filter(
      //   ({ item }: { item: ImageCarouselItem }) => item.uri && item.title,
      // )

      // if (itemsInView.length === 0) {
      //   return
      // }

      currentIndex.current = viewableItems[0].index
      setCurrentStateIndex(currentIndex.current)
      setIsNextDisabled(currentIndex.current === data.length)
      setIsPrevDisabled(currentIndex.current === 1)
    },
    [data],
  )

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

  const campaign = [
    {
      action: 'CAMPAIGN',
      category: 'campaign',
      description: 'Campaign',
      record_id: null,
      title: 'Wallet',
    },
  ]

  const taskArr: TTask[] = data?.data ?? []

  const newTaskArr = [...campaign, ...taskArr]
  const handlePressMarketing = () => {
    if (ewaEnabled) {
      navigation.navigate(EwaRoutes.Ewa)
    } else {
      navigateToURI('https://www.myworkpay.com/financial-services')
    }
  }
  const Card = ({ item, index }: { item: TTask; index: number }) => {
    return (
      <>
        {item.action !== 'CAMPAIGN' ? (
          <HStack
            paddingX={2}
            paddingTop={3}
            borderRadius={6}
            borderWidth={1}
            borderColor={'#3E8BEF'}
            bgColor={'#E7F1FD90'}
            width={windowWidth * 0.9}
            ml={index > 0 ? '32px' : 0}
            justifyContent="space-between">
            <VStack alignSelf="center" flex={3}>
              <Text
                fontFamily={'heading'}
                color="charcoal"
                fontSize="18px"
                marginBottom="6px">
                {item?.title ?? '-'}
              </Text>
              <Text marginBottom="8px">{item?.description ?? ''}</Text>
            </VStack>
            <Box height={90} overflow={'hidden'} bottom={0} flex={1}>
              <Vase height={'100%'} width="100%" />
            </Box>
          </HStack>
        ) : (
          <Pressable
            onPress={handlePressMarketing}
            borderRadius={6}
            borderWidth={1}
            borderColor={'#3E8BEF'}
            // height={10}
            bgColor={'#E7F1FD90'}
            width={windowWidth * 0.9}
            ml={index > 0 ? '32px' : 0}
            justifyContent="space-between">
            <Image
              source={Img}
              resizeMethod="resize"
              resizeMode="contain"
              height={100}
              alt="EWAComm"
            />
          </Pressable>
        )}
      </>
    )
  }

  if (isEmpty(data?.data) || !isArray(data?.data)) return null
  return (
    <Box pt="10px">
      <FlatList
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        data={newTaskArr}
        renderItem={({ item, index }) => <Card item={item} index={index} />}
        horizontal
        onViewableItemsChanged={handleOnViewableItemsChanged}
      />

      <View style={styles.footer}>
        {newTaskArr.map((item, index) => (
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
                currentStateIndex === index ? 'green.50' : '#D9D9D9'
              }
            />
          </Pressable>
        ))}
      </View>
    </Box>
  )
}

export default WelcomeCard

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
    paddingVertical: 10,
  },
})
