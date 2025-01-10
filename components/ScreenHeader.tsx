import React from 'react'
import { Heading, HStack, Pressable, Box } from 'native-base'
import BacKArrow from '../assets/svg/back-icon.svg'
import X from '../assets/svg/x.svg'
import { windowWidth } from '~utils/appConstants'

const leftMargin = windowWidth / 2 - 90
console.log(leftMargin)

type ScreenHeaderProps = {
  title: string
  close?: boolean
  onPress: () => void
  RightItem?: Function
}

const ScreenHeader = ({
  title,
  close,
  onPress,
  RightItem,
}: ScreenHeaderProps) => {
  return (
    <HStack alignItems="center" marginTop={'16px'}>
      <Pressable
        onPress={onPress}
        paddingY="10px"
        paddingRight="3px"
        position={'absolute'}
        zIndex={10001}>
        {close ? (
          <X width={24} height={24} color="#061938" />
        ) : (
          <BacKArrow width={24} height={24} color="#061938" />
        )}
      </Pressable>
      <Box flex={1}>
        <Heading mx={'auto'}>{title}</Heading>
      </Box>

      {RightItem ? <RightItem /> : <Box />}
    </HStack>
  )
}

export default ScreenHeader
