import React from 'react'
import { Box } from 'native-base'
import LoaderScreen from '~components/LoaderScreen'
import { useRoute } from '@react-navigation/native'
import { RECORDS_PER_PAGE } from '~constants/comon'
import { useLeavesFetchQuery } from '~api/leave'
import LeaveListing from './containers/LeaveListing'
import NoLeave from './component/NoLeave'
import ListContainer from '~components/ListContainer'

const LeavesTab = () => {
  const route = useRoute()

  const leaveCategory = route.params?.category

  const params = {
    status: route.params?.status,
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
  } = useLeavesFetchQuery(params)

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
        <LeaveListing
          leaves={listData ?? []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          category={leaveCategory}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      ) : (
        <NoLeave />
      )}
    </ListContainer>
  )
}

export default LeavesTab
