import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Box } from 'native-base'
import React from 'react'
import FloatingBtn from '~components/FloatingBtn'
import { ExpenseRoutes, MainStackParamList } from '~types'

import { FlatList } from 'react-native'
import ExpenseItem from '../components/ExpenseItem'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { noop } from 'lodash'
import NoExpense from '../components/NoExpense'


type ExpenseListingProps = {
  data: any
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  refetch: () => void
  isRefetching: boolean
}

type ExpenseNavigationProp = NavigationProp<MainStackParamList, keyof MainStackParamList>;

const ExpenseListing = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch,
  isRefetching,
}: ExpenseListingProps) => {
  const navigation = useNavigation<ExpenseNavigationProp>()

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
    <Box flex={1} backgroundColor="white" pt={'4px'} >
      <FlatList
        data={data}
        renderItem={({ item }) => <ExpenseItem item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={NoExpense}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshing={isRefetching}
        onRefresh={refetch}
      />

      <FloatingBtn onPress={() => navigation.navigate(ExpenseRoutes.Record)} />
    </Box>
  )
}

export default ExpenseListing
