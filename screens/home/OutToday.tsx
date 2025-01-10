import { StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import {
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import PeopleIcon from '../../assets/svg/PeapleIcon'
import { useNavigation } from '@react-navigation/native'
import { PeopleRoutes } from '../../types'
import { useActiveLeaves } from '~api/home'
import { windowWidth } from '~utils/appConstants'
import { isEmpty } from 'lodash'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

type outTodayT = {
  employee_id: number
  employee_name: string
  profile_picture: string
}

type OutTodayProps = {
  setRefetching: (value: boolean) => void
}

const personWidth = windowWidth / 7.1115

const OutToday = forwardRef(({ setRefetching }: OutTodayProps, ref) => {
  const navigation = useNavigation()

  const { data, isLoading, refetch, isRefetching } = useActiveLeaves()

  useEffect(() => {
    setRefetching(isRefetching)
  }, [isRefetching])

  useImperativeHandle(ref, () => ({
    refetch,
  }))

  const outToday: outTodayT[] = data?.data?.data

  const Person = ({ item, index }: { item: outTodayT; index: number }) => {
    return (
      <Box textAlign={'center'} marginLeft={index === 0 ? 0 : 3}>
        {item.profile_picture ? (
          <Box
            backgroundColor="green.20"
            width={personWidth}
            height={personWidth}
            rounded="full"
            alignItems="center"
            justifyContent="center">
            <Image
              alt={Array.from(item.employee_name)[0]}
              source={{
                uri: item.profile_picture,
              }}
              width={personWidth}
              height={personWidth}
              borderRadius={personWidth / 2}
              marginBottom={1}
            />
          </Box>
        ) : (
          <Box
            backgroundColor="green.20"
            width={personWidth}
            height={personWidth}
            rounded="full"
            alignItems="center"
            justifyContent="center">
            <Heading color="green.50">
              {Array.from(item.employee_name)[0]}
            </Heading>
          </Box>
        )}
        <Text fontSize="14px" textAlign="center" color={'charcoal'} mt={'7px'}>
          {item.employee_name ? item.employee_name.split(' ')[0] : '-'}
        </Text>
      </Box>
    )
  }

  const MorePeople = ({ count }: { count: number }) => (
    <Pressable
      style={styles.moreBtn}
      onPress={() => {
        navigation.navigate(PeopleRoutes.Peoples, { filterText: 'leaves' })
        analyticsTrackEvent(AnalyticsEvents.Home.more_people, {})
      }}>
      <Box
        backgroundColor={'#F0FBEA'}
        width={personWidth}
        height={personWidth}
        borderRadius={personWidth}
        alignItems="center"
        justifyContent="center">
        <PeopleIcon />
      </Box>
      <Text textAlign="center" fontSize="14px" color={'charcoal'} mt={'7px'}>
        {count} more
      </Text>
    </Pressable>
  )

  const EmptyState = () => (
    <Box
      borderRadius={'8px'}
      borderWidth={1}
      borderColor="#D5D4D4"
      paddingX="16px"
      paddingY="20px"
      marginY="20px">
      <HStack alignItems="center">
        <Box
          alignItems={'center'}
          justifyContent={'center'}
          background={'#F0FBEA'}
          borderRadius={'28px'}
          width={'56px'}
          height={'56px'}>
          <PeopleIcon width={24} height={24} />
        </Box>
        <Box>
          <VStack marginLeft={'24px'} width={'85%'}>
            <Text
              fontSize="18px"
              color="charcoal"
              lineHeight={'21px'}
              maxWidth={'100%'}>
              Everyone is present
            </Text>
            <Text
              fontSize="14px"
              color="charcoal"
              marginTop="4px"
              lineHeight={'22px'}>
              Team mates who are on leave will show up here
            </Text>
          </VStack>
        </Box>
      </HStack>
    </Box>
  )

  return (
    <Box marginTop={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <Heading fontSize="20px">Out today</Heading>
        <Pressable
          style={styles.linkBtn}
          onPress={() => {
            navigation.navigate(PeopleRoutes.Peoples)
            analyticsTrackEvent(AnalyticsEvents.Home.see_people, {})
          }}>
          <Text color="#62A446" fontSize="16px">
            See people
          </Text>
        </Pressable>
      </HStack>
      {isLoading || isEmpty(outToday) ? (
        <EmptyState />
      ) : (
        <HStack
          borderRadius={8}
          borderWidth={1}
          borderColor="#D5D4D4"
          padding={2}
          marginY={2}>
          {outToday.slice(0, 4).map((item, index) => {
            return <Person key={index} index={index} item={item} />
          })}
          {outToday.length > 4 ? (
            <MorePeople count={outToday.length - 4} />
          ) : null}
        </HStack>
      )}
    </Box>
  )
})

OutToday.displayName = 'OutToday'

export default OutToday

const styles = StyleSheet.create({
  header: {
    fontWeight: '500',
    fontSize: 20,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#62A446',
  },
  nameTxt: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    color: '#253545',
  },
  moreBtn: {
    marginLeft: 5,
    alignItems: 'center',
  },
})
