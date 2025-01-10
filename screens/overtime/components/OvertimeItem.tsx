import { useNavigation } from '@react-navigation/native'
import { parse } from 'date-fns'
import { capitalize } from 'lodash'
import { Badge, HStack, Text, Divider, Pressable, Box } from 'native-base'
import React from 'react'
import { dateToString } from '~utils/date'
import { OvertimeRoutes } from '../../../types'
import { TOvertime } from '../types'

const OvertimeItem = ({ item }: { item: TOvertime }) => {
  const navigation = useNavigation()
  const hours = item.hours ?? item.hours_2_0x
  const tHours = hours + ' hrs' ?? '' + 'hrs'
  const date = dateToString(item.date, 'd/M/yyyy') ?? ''
  const timeFrom = dateToString(
    parse(item.time_from, 'HH:mm:ss', new Date()),
    'hh:mm bbb',
  )
  const status = item.status ?? '-'

  let color = 'green.50'
  if (status === 'PENDING') {
    color = 'chrome.50'
  } else if (status === 'REJECTED') {
    color = 'red.50'
  }
  return (
    <Pressable
      mt="20px"
      onPress={() => navigation.navigate(OvertimeRoutes.Details, { item })}>
      <HStack justifyContent="space-between" mb="6px">
        <Text color="charcoal" fontSize="18px" fontFamily={'heading'}>
          {tHours}
        </Text>
        <Badge bgColor={color}>{capitalize(status)}</Badge>
      </HStack>
      <HStack mb="20px">
        <Text color="charcoal" fontSize="16px">
          {date}
        </Text>
        <Box
          rounded="full"
          height="5px"
          width="5px"
          backgroundColor="charcoal"
          alignSelf="center"
          mx="3px"
        />
        <Text color="charcoal" fontSize="16px">
          {timeFrom}
        </Text>
      </HStack>

      <Divider color="red.40" />
    </Pressable>
  )
}

export default OvertimeItem
