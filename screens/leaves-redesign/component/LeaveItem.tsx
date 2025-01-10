import { useNavigation } from '@react-navigation/native'
import { Pressable, Box, HStack, Text, Badge, Divider } from 'native-base'
import React from 'react'
import { Dimensions } from 'react-native'
import AnnualIcon from '~assets/svg/annual-leave.svg'
import BigDot from '~components/BigDot'
import { LeaveRoutes, LeaveRoutesRedesign } from '~types'
import { TLeaveItem } from '../types'
import { dateToString } from '~utils/date'
import { useLeaveStatus } from '~hooks/useLeaveStatus'
import SickIcon from '~assets/svg/sick-leave.svg'
import CompasionateIcon from '~assets/svg/compasionate.svg'
import MaternityIcon from '~assets/svg/maternity.svg'
import StudyIcon from '~assets/svg/study-leave.svg'

const { width } = Dimensions.get('screen')

const LeaveItem = ({ item }: { item: TLeaveItem }) => {
  const navigation = useNavigation()
  const { status, variant } = useLeaveStatus(item.status)
  let LeaveIcon = AnnualIcon
  let bgColor = '#F0FBEA'
  switch (item.leave_type_name) {
    case 'Compassionate Leave':
      LeaveIcon = CompasionateIcon
      bgColor = '#FEE9E7'
      break
    case 'Sick Leave':
      LeaveIcon = SickIcon
      bgColor = '#FDF1DA'
      break
    case 'Maternity Leave':
    case 'Paternity':
      LeaveIcon = MaternityIcon
      break
    case 'Study Leave':
      LeaveIcon = StudyIcon
      bgColor = '#E3E9EC'
      break
    default:
      break
  }

  const ItemIcon = () => {
    return (
      <Box backgroundColor={bgColor} rounded="full" padding="12px">
        <LeaveIcon width={width * 0.09} height={width * 0.09} />
      </Box>
    )
  }
  const fromDate = dateToString(item.from, 'MMM do')
  const toDate = dateToString(item.to, 'do')

  return (
    <Pressable
      mt="15px"
      onPress={() =>
        navigation.navigate(LeaveRoutesRedesign.Details, { item })
      }>
      <HStack>
        <ItemIcon />
        <Box flex={1} ml="8px">
          <HStack alignItems="center" mb="4px">
            <Text
              color="charcoal"
              fontSize={'16px'}
              mr={'2px'}
              ellipsizeMode="clip">
              {item.leave_type_name ?? '-'}
            </Text>
            <BigDot />
            <Text
              color="charcoal"
              fontSize={'16px'}
              ml={'2px'}
              numberOfLines={1}>
              {item.duration ?? '-'}
            </Text>
          </HStack>
          <Text fontSize={'14px'}>{fromDate + ' - ' + toDate}</Text>
        </Box>
        <Badge variant={variant}>{status}</Badge>
      </HStack>
      <Divider mt="15px" />
    </Pressable>
  )
}

export default LeaveItem
