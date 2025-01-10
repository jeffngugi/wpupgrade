import { Box, Divider, HStack, Text } from 'native-base'
import React from 'react'
import { useMyProfile } from '~api/account'
import UserAvatar from '~components/UserAvatar'
import ArrowIcon from '~assets/svg/arrow.svg'
import { TReport } from '../AttendanceReport'
import { isString } from 'lodash'
import { dateToString } from '~utils/date'

const ReportItem = ({ item, index }: { item: TReport; index: number }) => {
  const { data } = useMyProfile()
  const timeIn = isString(item.time_in) ? item.time_in.split(' ')[1] : ''
  const timeOut = isString(item.time_out) ? item.time_out.split(' ')[1] : '-'
  const attendanceDate = dateToString(item.attendance_date, 'MMM dd') ?? '-'
  const trimName: string = data?.data?.employee_name.trim() ?? '-'
  const fallbackTXT = Array.from(trimName)[0]

  return (
    <Box>
      {index === 0 ? <Divider /> : null}
      <HStack my="20px" alignItems="center">
        <Box alignItems={'center'}>
          <UserAvatar
            width="48px"
            height="48px"
            fallback={fallbackTXT}
            url={data?.data?.profile_picture}
          />
        </Box>
        <Box flex={'1'} ml={'16px'}>
          <HStack justifyContent="space-between" alignItems="center">
            <HStack alignItems="center" my="8px">
              <Text fontSize="16px" color="charcoal" lineHeight={'19.2px'}>
                {timeIn}
              </Text>
              <Box mx="10px">
                <ArrowIcon color="#62A446" />
              </Box>
              <Text fontSize="16px" color="charcoal" lineHeight={'19.2px'}>
                {timeOut}
              </Text>
            </HStack>
            <Text fontSize="16px" color="charcoal" lineHeight={'19.2px'}>
              {attendanceDate}
            </Text>
          </HStack>
          <Text fontSize="16px" color={'grey'} lineHeight={'19.2px'}>
            {item.duration}
          </Text>
        </Box>
      </HStack>
      <Divider />
    </Box>
  )
}

export default ReportItem
