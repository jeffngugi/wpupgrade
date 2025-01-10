import React from 'react'
import { Box } from 'native-base'
import LoaderScreen from '~components/LoaderScreen'
import { useRoute } from '@react-navigation/native'
import { RECORDS_PER_PAGE } from '~constants/comon'
import OvertimeListing from './OvertimeListing'
import NoOvertime from './NoOvertime'
import { useFetchOvertimeInfinite } from '~api/overtime'

const OvertimeTab = () => {
  const route = useRoute()

  const category = route.params?.category

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
  } = useFetchOvertimeInfinite(params)

  const listData = React.useMemo(
    () => data?.pages.flatMap(page => page.data?.data || []),
    [data?.pages],
  )

  if (queryStatus === 'loading') {
    return <LoaderScreen />
  }

  return (
    <Box flex={1}>
      {listData?.length ? (
        <OvertimeListing
          overtimeData={listData}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      ) : (
        <NoOvertime />
      )}
    </Box>
  )
}

export default OvertimeTab
