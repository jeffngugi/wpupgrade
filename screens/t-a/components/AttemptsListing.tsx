import React from 'react'
import { Box, Divider, SectionList, Text } from 'native-base'
import AttemptItem from './AttemptItem'
import { useSelector } from 'react-redux'
import { ClockInOut, State } from '~declarations'
import { isEmpty } from 'lodash'
import EmptyState from '~components/empty-state/EmptyState'
import { AppModules } from '~types'
import { ListRenderItem } from 'react-native'
import { dateToString, isToday } from '~utils/date'

type TSortedAttempts = {
  title: string
  data: ClockInOut[]
}

const AttemptsListing = () => {
  const { clockInsOuts } = useSelector((state: State) => state.ta)
  if (isEmpty(clockInsOuts)) return <EmptyState moduleName={AppModules.ta} />

  const renderItem: ListRenderItem<ClockInOut> = ({ item }) => {
    return <AttemptItem item={item} />
  }

  const Header = ({ title }: { title: string }) => (
    <Box>
      <Text
        mt="20px"
        mx="16px"
        fontFamily={'heading'}
        fontSize="18px"
        color="charcoal"
        my="12px">
        {title}
      </Text>
      <Divider />
    </Box>
  )

  const attempts: ClockInOut[] = clockInsOuts ?? []

  const newAttemptData = attempts.reduce((r, e) => {
    const title = e.expireAt.split('T')[0]
    if (!r[title])
      r[title] = {
        title: isToday(title)
          ? `Today, ${dateToString(title, 'LLLL dd')}`
          : dateToString(title, 'EEEE, LLLL dd'),
        data: [e],
      }
    else r[title].data.push(e)
    return r
  }, {})

  const sortedAttempts: TSortedAttempts[] = Object.values(newAttemptData)

  return (
    <Box flex={1}>
      <SectionList
        py="32px"
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        sections={sortedAttempts}
        keyExtractor={(_, index) => `key ${index}`}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Header title={title} />
        )}
      />
    </Box>
  )
}

export default AttemptsListing
