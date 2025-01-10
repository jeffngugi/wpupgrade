import React from 'react'
import { Box, Text } from 'native-base'
import NoRecurringIcon from '~assets/svg/no-recurring.svg'

const NoRecurring = () => {
  return (
    <Box flex={1} alignItems="center" justifyContent={'center'}>
      <NoRecurringIcon />
      <Text
        lineHeight="28px"
        fontSize="20px"
        fontFamily="heading"
        marginTop="20px"
        color="#253545">
        You have no recurring payments
      </Text>
      <Text
        lineHeight="22px"
        fontSize="16px"
        textAlign="center"
        marginTop="10px">
        Your recurring payments will show {'\n'} up here.
      </Text>
    </Box>
  )
}

export default NoRecurring
