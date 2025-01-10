import React from 'react'
import { Box, FlatList } from 'native-base'

import { isEmpty, noop } from 'lodash'
// import NoAdvance from '~screens/leaves/component/NoAdvance'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import NotificationCard from '../componets/NotificationCard'

const NotificationListing = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: {
  data: any[]
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  refetch: () => void
  isRefetching: boolean
}) => {
  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage

  const renderFooter = () => {
    if (!hasNextPage) return null
    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }

  const renderItem = ({ item }) => <NotificationCard item={item} />

  return (
    <Box flex={1}>
      {isEmpty(data) ? (
        <Box />
      ) : (
        <Box flex={1}>
          <FlatList
            data={data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            keyExtractor={item => item.id.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        </Box>
      )}
    </Box>
  )
}

export default NotificationListing
