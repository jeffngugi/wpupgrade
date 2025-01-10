import React from 'react'
import { Box, FlatList } from 'native-base'
import AdvanceItem from '../components/AdvanceItem'
import FloatingBtn from '~components/FloatingBtn'
import { useNavigation } from '@react-navigation/native'
import { AdvanceRoutes } from '~types'
import { isEmpty, noop } from 'lodash'
import NoAdvance from '~screens/advance/components/NoAdvance'
import LoaderScreen from '~components/LoaderScreen'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'

const AdvanceListing = ({
  data,
  category,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: {
  data: any[]
  category: string
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
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

  const renderItem = ({ item }) => <AdvanceItem item={item} />

  return (
    <Box flex={1}>
      {isEmpty(data) ? (
        <NoAdvance />
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
          <FloatingBtn
            onPress={() => navigation.navigate(AdvanceRoutes.Apply)}
          />
        </Box>
      )}
    </Box>
  )
}

export default AdvanceListing
