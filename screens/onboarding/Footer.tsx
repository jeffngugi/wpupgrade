import { View } from 'react-native'
import React from 'react'
import { Button, Text, HStack } from 'native-base'
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types'
import CircleBtn from './CircleBtn'
import NextIcon from '../../assets/svg/next.svg'
import BackIcon from '../../assets/svg/back.svg'

type FooterProps = {
  onNext: any
  toLogin: any
  onBack: any
  currentPage: number
  bgColor: ResponsiveValue<ColorType>
}

const Footer = ({
  onBack,
  onNext,
  currentPage,
  bgColor,
  toLogin,
}: FooterProps) => {
  return (
    <HStack
      // backgroundColor={bgColor}
      justifyContent="space-between"
      paddingX={'24px'}
      mb={'1px'}
      alignItems="center">
      {currentPage > 0 ? (
        <CircleBtn size={56} onPress={onBack}>
          <NextIcon />
        </CircleBtn>
      ) : (
        <View />
      )}
      {currentPage < 2 ? (
        <CircleBtn size={56} onPress={onNext}>
          <BackIcon />
        </CircleBtn>
      ) : (
        <Button
          backgroundColor="#62A446"
          borderRadius={6}
          paddingX={10}
          onPress={toLogin}>
          <Text
            color={'#ffffff'}
            marginX={'18px'}
            marginY={2}
            fontFamily={'heading'}
            fontSize={'16px'}>
            Login
          </Text>
        </Button>
      )}
    </HStack>
  )
}

export default Footer
