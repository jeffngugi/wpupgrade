import React from 'react'
import { Box, FlatList } from 'native-base'
import EwaTransactionCard from './components/EwaTransactionCard'
import { useEwaTransctions } from '~api/ewa'
import LoaderScreen from '~components/LoaderScreen'
import { isEmpty, noop } from 'lodash'
import EmptyState from '~components/empty-state/EmptyState'
import { AppModules, TEwaTransaction } from '~types'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { RECORDS_PER_PAGE } from '~constants/comon'

const EwaTrasactions = () => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const params = {
    employee_id,
    recordsPerPage: RECORDS_PER_PAGE,
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
    isRefetching,
  } = useEwaTransctions(params as any)

  const ewaTransactionsList = React.useMemo(
    () => data?.pages?.flatMap(page => page?.data?.data || []),
    [data?.pages],
  )

  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage

  const renderFooter = () => {
    if (!hasNextPage) return null
    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }

  if (queryStatus == 'loading') return <LoaderScreen />
  return (
    <Box flex={1} paddingX="16px" backgroundColor="white">
      {ewaTransactionsList?.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          flex={1}
          data={ewaTransactionsList}
          renderItem={({ item }) => <EwaTransactionCard item={item} />}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      ) : (
        <EmptyState moduleName={AppModules.ewa} />
      )}
    </Box>
  )
}

export default EwaTrasactions
