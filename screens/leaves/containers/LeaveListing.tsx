import React from 'react'
import { Box, FlatList, Text } from 'native-base'
import LeaveItem from '../component/LeaveItem'
import FloatingBtn from '~components/FloatingBtn'
import { useNavigation } from '@react-navigation/native'
import { LeaveRoutes } from '~types'
import { noop } from 'lodash'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { SectionList } from 'react-native'
import { LEAVE_STATUS } from '../constants'

const LeaveListing = ({
  leaves,
  category,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: {
  leaves: any[]
  category: string
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  refetch: () => void
  isRefetching: boolean
}) => {
  const navigation = useNavigation()

  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage
  const renderFooter = () => {
    if (!hasNextPage) return null
    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }
  const renderItem = ({ item, index }) => <LeaveItem item={item} />

  const activeleaves =
    leaves?.filter(leave => leave.status === LEAVE_STATUS.ACTIVE) ?? []
  const otherLeaves =
    leaves?.filter(leave => leave.status !== LEAVE_STATUS.ACTIVE) ?? []

  const SORTED_DATA = [
    {
      title: 'Active Leaves',
      data: activeleaves,
    },
    {
      title: 'Leaves',
      data: otherLeaves,
    },
  ]

  return (
    <Box flex={1}>
      {category == 'ALL' ? (
        <SectionList
          sections={SORTED_DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <LeaveItem item={item} />}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              fontSize="18px"
              color="charcoal"
              fontFamily="heading"
              mt={'20px'}>
              {title}
            </Text>
          )}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      ) : (
        <FlatList
          data={leaves}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      )}
      <FloatingBtn onPress={() => navigation.navigate(LeaveRoutes.Request)} />
    </Box>
  )
}

export default LeaveListing
