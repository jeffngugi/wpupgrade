import React from 'react'
import LoaderScreen from '~components/LoaderScreen'
import { useRoute } from '@react-navigation/native'
import { RECORDS_PER_PAGE } from '~constants/comon'
import ListContainer from '~components/ListContainer'
import AdvanceListing from './containers/AdvanceListing'
import NoAdvance from '~screens/advance/components/NoAdvance'
import { useInfiniteAdvanceFetchQuery } from '~api/advance'

type AdvancesParams = {
  approval_status?: string
  recordsPerPage?: number
  paid?: number
}

const AdvancesTab = () => {
  const route = useRoute()

  const category = route.params?.category

  const params: AdvancesParams = {
    approval_status: route.params?.status,
    recordsPerPage: RECORDS_PER_PAGE,
  }

  if (category === 'Paid') {
    params.paid = 1
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
  } = useInfiniteAdvanceFetchQuery(params)

  const listData = React.useMemo(
    () => data?.pages.flatMap(page => page.data?.data || []),
    [data?.pages],
  )
  if (queryStatus === 'loading') {
    return <LoaderScreen />
  }

  return (
    <ListContainer>
      {listData?.length ? (
        <AdvanceListing
          data={listData ?? []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          category={category}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      ) : (
        <NoAdvance />
      )}
    </ListContainer>
  )
}

export default AdvancesTab
