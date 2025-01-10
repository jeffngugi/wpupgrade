import React from 'react'
import {
  Avatar,
  HStack,
  Text,
  Box,
  Pressable,
  Badge,
  VStack,
  View,
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { MainNavigationProp, PeopleRoutes } from '../../../types'
import AnnualIcon from '~assets/svg/annual-leave.svg'
import AnniversaryIcon from '~assets/svg/anniversary.svg'
import BirthdayIcon from '~assets/svg/cake.svg'
import { contactColors } from '~constants/Colors'
import { TColleague } from '../types'
import { differenceInMonths, formatDistance } from 'date-fns'
import { isNull, isUndefined } from 'lodash'
import { dateToString, fromBackedDate } from '~utils/date'
import { differenceInYears } from 'date-fns/esm'
import { useAccountSettings } from '~api/settings'

const PersonListCard = ({
  item,
  index,
  filterText,
}: {
  item: TColleague
  index: number
  filterText?: string
}) => {
  const navigation: MainNavigationProp<PeopleRoutes.Peoples> = useNavigation()
  let newEmployee = false
  let isAnniversary = false
  let topText = ''
  let bottomText = ''
  const lengthOfServiceInYears = differenceInYears(
    new Date(),
    new Date(item.date_employed),
  )

  const { data: settingData } = useAccountSettings()

  const anniversaryHidden = settingData?.data?.disable_work_anniversary_info
  const birthdayHidden = settingData?.data?.disable_birthday_info

  const isBirthdayUpcoming = filterText === 'birthdays'
  if (
    differenceInMonths(new Date(), new Date(item.date_employed)) < 4 &&
    !isBirthdayUpcoming
  ) {
    newEmployee = true
    topText = ''
    const days = formatDistance(new Date(), new Date(item.date_employed))
    bottomText = `Joined ${days} ago`
  } else if (
    dateToString(new Date(), 'MMMM do') ===
      dateToString(new Date(item.date_employed), 'MMMM do') &&
    lengthOfServiceInYears > 0 &&
    !isBirthdayUpcoming &&
    !anniversaryHidden
  ) {
    newEmployee = false
    topText = dateToString(new Date(), 'd MMM')
    bottomText = `${lengthOfServiceInYears} year(s) anniversary`
    isAnniversary = true
  } else if (!isNull(item.leave_details)) {
    const startDate = fromBackedDate(item.leave_details.leave_from)
    const endDate = fromBackedDate(item.leave_details.leave_to)
    const start = !isUndefined(startDate)
      ? dateToString(startDate, 'MMM dd')
      : '-'
    const end = !isUndefined(endDate) ? dateToString(endDate, 'dd') : '-'
    newEmployee = false
    topText = `${start} - ${end}`
    bottomText = ''
  } else if (isBirthdayUpcoming && !birthdayHidden) {
    newEmployee = false
    topText = item?.birthday
    bottomText = ''
  } else {
    newEmployee = false
    topText = ''
    bottomText = ''
  }
  return (
    <Pressable
      my="14px"
      justifyContent="space-between"
      flexDirection={'row'}
      alignItems="center"
      onPress={() =>
        navigation.navigate(PeopleRoutes.Person, { person: item })
      }>
      <HStack>
        <Avatar
          width="40px"
          height="40px"
          backgroundColor={contactColors[index % contactColors.length]}
          source={{ uri: item.avatar }}>
          {item.name[0] ?? '-'}
        </Avatar>
        <VStack ml="10px" justifyContent="center" flex={1}>
          <Box alignItems="flex-start" flexDirection={'column'} flex={1}>
            <HStack alignItems="center" flex={1}>
              <Box flex={0} flexShrink={1}>
                <Text
                  fontSize="18px"
                  color="charcoal"
                  fontFamily={'heading'}
                  numberOfLines={1}>
                  {item.name ?? '-'}
                </Text>
              </Box>
              <Box flexGrow={1} />
              <Box alignItems={'flex-end'} flexDir={'row'}>
                {newEmployee ? (
                  <Badge background="green.50">New</Badge>
                ) : !isNull(item.leave_details) ? (
                  <AnnualIcon width="18px" height="18px" />
                ) : isAnniversary && !anniversaryHidden ? (
                  <AnniversaryIcon />
                ) : isBirthdayUpcoming && !birthdayHidden ? (
                  <BirthdayIcon />
                ) : null}
                <Text color="charcoal" fontSize={'14px'} ml={'4px'}>
                  {topText}
                </Text>
              </Box>
            </HStack>
            <HStack flex={1}>
              <Text
                fontSize={'14px'}
                mt={'2px'}
                color={'grey'}
                numberOfLines={1}
                flex={0}
                flexShrink={1}>
                {item.job_title ?? '-'}
              </Text>
              <Box flexGrow={1} />
              <Text fontSize={'14px'} color={'grey'} mt={'2px'}>
                {bottomText}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </HStack>
    </Pressable>
  )
}

export default PersonListCard
