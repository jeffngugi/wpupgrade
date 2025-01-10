import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import { useGetWalletUser, useWalletTransactionsFetchQuery } from '~api/wallet'
import LoaderScreen from '~components/LoaderScreen'
import SearchInput from '~components/SearchInput'
import { Box, FlatList } from 'native-base'
import WalletTransactionItem from './components/WalletTransactionItem'
import { useDebouncedSearch } from '~hooks/useDebouncedSearch'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'

import { noop } from 'lodash'
import { WalletRoutes } from '~types'
import { ExportBtn } from '~components/DownloadBtn'
import { RECORDS_PER_PAGE } from '~constants/comon'

export const walletRenderItem = ({ index, item }) => {
  return <WalletTransactionItem item={item} index={index} />
}

const WalletTransactions = ({ navigation }) => {
  const { data: walletData } = useGetWalletUser()
  const [searchText, handleSearch] = useDebouncedSearch('', 500)

  const walletParams = {
    wallet_id: walletData?.data?.wallets[0]?.uuid,
    search_text: searchText,
    records_per_page: RECORDS_PER_PAGE,
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
  } = useWalletTransactionsFetchQuery(walletParams)
  // console.log(data?.pages, 'data?.pages')
  const listData = React.useMemo(
    () => data?.pages?.flatMap(page => page.data?.data || []),
    [data?.pages],
  )

  const transactions = listData ?? []

  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage
  const renderFooter = () => {
    if (!hasNextPage) return null
    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }
  const RightItem = () => (
    <ExportBtn
      onPress={() => navigation.navigate(WalletRoutes.WalletStatements)}
    />
  )

  if (queryStatus === 'loading') return <LoaderScreen />

  return (
    <ScreenContainer>
      <Box mt="4px" />
      <ScreenHeader
        title="Transactions"
        onPress={() => navigation.goBack()}
        RightItem={RightItem}
      />
      <Box my="4px" />
      <SearchInput
        placeholder="Search transactions"
        handleSearch={handleSearch}
      />
      <FlatList
        mt="20px"
        data={transactions}
        renderItem={walletRenderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </ScreenContainer>
  )
}

export default WalletTransactions
