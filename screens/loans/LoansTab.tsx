import React from 'react'
import { Box } from 'native-base'
import NoLoans from './components/NoLoans'
import LoanListing from './containers/LoanListing'
import LoaderScreen from '~components/LoaderScreen'
import { useLoansFetchQuery } from '~api/loans'
import { useRoute } from '@react-navigation/native'
import { RECORDS_PER_PAGE } from '~constants/comon'

const LoansTab = () => {
  const route = useRoute()
  const status = route.params?.loanStatus
  const loanCategory = route.params?.loanCategory

  const params = { status, recordsPerPage: RECORDS_PER_PAGE }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status: queryStatus,
  } = useLoansFetchQuery(params)

  const listData = React.useMemo(
    () => data?.pages.flatMap(page => page.data?.data?.data || []),
    [data?.pages],
  )

  if (queryStatus === 'loading') {
    return <LoaderScreen />
  }
  return (
    <Box flex={1}>
      {listData?.length ? (
        <LoanListing
          data={listData}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loanCategory={loanCategory}
        />
      ) : (
        <NoLoans loanCategory={loanCategory} />
      )}
    </Box>
  )
}

export default LoansTab
