import React from 'react'
import { Box, Divider, HStack, ScrollView, Text, Badge } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import { dateToString, formatDate } from '~utils/date'
import { parse } from 'date-fns'
import { capitalize } from 'lodash'
import { t } from 'i18next'

type DetailItemProps = {
  label: string
  value: string
}
const OvertimeDetails = ({ item: overtime }) => {
  const date = formatDate(overtime?.date, 'shortMonth') ?? '-'
  const fromTime = parse(overtime?.time_from, 'HH:mm:ss', new Date())
  const timeFrom = dateToString(fromTime, 'hh:mm a') ?? '-'
  const hours = overtime?.hours ?? '-'
  let bgColor = 'green.50'
  if (overtime?.status === 'PENDING') {
    bgColor = 'chrome.50'
  } else if (overtime?.status === 'REJECTED') {
    bgColor = 'red.50'
  }
  const DetailItem = ({ label, value }: DetailItemProps) => {
    return (
      <Box>
        <HStack justifyContent="space-between" my="20px" alignItems="center">
          <Text fontSize={'14px'} color={'grey'}>
            {label}
          </Text>
          {label === 'Status' ? (
            <Badge bgColor={bgColor}>{value ? capitalize(value) : '-'}</Badge>
          ) : (
            <Text fontSize="16px" color="charcoal">
              {value}
            </Text>
          )}
        </HStack>
        <Divider />
      </Box>
    )
  }
  return (
    <ScrollView>
      <Box mt="32px" />
      <DetailItem label="Date" value={date} />
      <DetailItem label="Start time" value={timeFrom} />
      <DetailItem label="Number of hours worked" value={`${hours} hours`} />
      <DetailItem label="Status" value={overtime?.status} />

      <Text color="charcoal" mt="20px" fontSize={'14px'}>
        {t('reason')}
      </Text>
      <Text fontFamily={'heading'} fontSize={'16px'} mt={'5px'}>
        {overtime?.notes ?? ''}
      </Text>
    </ScrollView>
  )
}

export default OvertimeDetails
