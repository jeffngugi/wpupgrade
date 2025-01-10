import React from 'react'
import { Box } from 'native-base'
import LoaderScreen from '~components/LoaderScreen'
import ExpenseListing from './containers/ExpenseListing'
import NoExpense from './components/NoExpense'
import { useRoute } from '@react-navigation/native'
import { useExpensesFetchQuery } from '~api/expenses'
import { RECORDS_PER_PAGE } from '~constants/comon'
import { RouteProp } from '@react-navigation/native'
import { ExpenseRouteInitialParams } from './types'

type ExpenseRoute = RouteProp<{ params: ExpenseRouteInitialParams }, 'params'>;

const ExpensesTab = () => {
  const route = useRoute<ExpenseRoute>()

  const expenseCategory = route.params?.expenseCategory

  const params = {
    ...route.params?.expenseStatus,
    recordsPerPage: RECORDS_PER_PAGE,
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
  } = useExpensesFetchQuery(params)

  const listData = React.useMemo(
    () => data?.pages.flatMap(page => page.data?.data?.expenses?.data || []),
    [data?.pages],
  )

  if (queryStatus === 'loading') {
    return <LoaderScreen />
  }

  return (
    <Box flex={1}>
      {listData?.length ? (
        <ExpenseListing
          data={listData}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          refetch={refetch}
          isRefetching={isRefetching}
        />
      ) : (
        <NoExpense expenseCategory={expenseCategory} />
      )}
    </Box>
  )
}

export default ExpensesTab
