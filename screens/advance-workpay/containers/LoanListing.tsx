import React from 'react'
import { Box, Text } from 'native-base'
import FloatingBtn from '~components/FloatingBtn'
import { useNavigation } from '@react-navigation/native'
import { AdvanceLoanRoutes, LoanRoutes } from '~types'
import { FlatList, SectionList } from 'react-native'
import LoanTabItem from '../components/LoanTabItem'
import LoadMoreBtn from '~components/buttons/LoadMoreBtn'
import { noop } from 'lodash'
import NoLoans from '../components/NoLoans'
import { LOAN_STATUSES } from '../constants'

type LoanListingProps = {
  data: any
  loanCategory: string
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
}

const LoanListing = ({
  data,
  loanCategory,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: LoanListingProps) => {
  const navigation = useNavigation()
  const loadMore = isFetchingNextPage || !hasNextPage ? noop : fetchNextPage
  const renderFooter = () => {
    if (!hasNextPage) {
      return null
    }

    return (
      <Box>
        <LoadMoreBtn onPress={loadMore} loading={isFetchingNextPage} />
      </Box>
    )
  }
  const activeloans = data.filter(loan => loan.status === LOAN_STATUSES.ACTIVE)
  const otherLoans = data.filter(loan => loan.status !== LOAN_STATUSES.ACTIVE)
  const SORTED_DATA = [
    {
      title: 'Active Loans',
      data: activeloans,
    },
    {
      title: 'Loans',
      data: otherLoans,
    },
  ]

  return (
    <Box flex={1} backgroundColor="white" pt={'4px'}>
      {loanCategory == 'ALL' ? (
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={SORTED_DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <LoanTabItem item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              fontSize="18px"
              color="charcoal"
              fontFamily="heading"
              mt={'20px'}>
              {title}
            </Text>
          )}
          ListEmptyComponent={NoLoans}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <LoanTabItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={NoLoans}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      )}

      <FloatingBtn
        onPress={() => navigation.navigate(AdvanceLoanRoutes.Apply)}
      />
    </Box>
  )
}

export default LoanListing
