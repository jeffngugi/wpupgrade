import React from 'react'
import { Box, Text } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import ClockInOutBtns from '~screens/home/ClockInOutBtns'
import { dateToString } from '~utils/date'

import Timer from './Timer'

const TAHeroCard = () => {
  const today = dateToString(new Date(), 'EEEE, LLLL dd')

  return (
    <Box
      borderWidth="3px"
      borderColor="white"
      borderRadius="6px"
      mt={'24px'}
      height={'214px'}
      shadow={10}
      background={'rgba(224,191,191, 0.2)'}>
      <LinearGradient
        colors={['#F0F5ED50', '#D6F1CA50']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 6, flex: 1 }}>
        <Text mt="20px" fontSize="18px" alignSelf="center" color="charcoal">
          {today}
        </Text>
        <Timer />
        <Box px="16px" py="16px">
          <ClockInOutBtns />
        </Box>
      </LinearGradient>
    </Box>
  )
}

export default TAHeroCard
