import React from 'react'
import { Box, FlatList } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { OvertimeRoutes } from '../../types'
import OvertimeItem from './components/OvertimeItem'
import FloatingBtn from '../../components/FloatingBtn'
import { TOvertime } from './types'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { noop } from 'lodash'

type OvertimeListingProps = {
  overtimeData: any[]
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  refetch: () => void
  isRefetching: boolean
}

const OvertimeListing = ({
  overtimeData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: OvertimeListingProps) => {
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
  return (
    <Box flex={1} backgroundColor="white">
      <FlatList
        data={overtimeData}
        renderItem={({ item }) => <OvertimeItem item={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
      <FloatingBtn
        onPress={() => navigation.navigate(OvertimeRoutes.RequestForm)}
      />
    </Box>
  )
}

export default OvertimeListing
