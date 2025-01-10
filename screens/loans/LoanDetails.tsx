import { Box, Text, Pressable, Divider, ScrollView } from 'native-base'
import React from 'react'
import ScreenHeader from '~components/ScreenHeader'
import LoanDetailHero from './components/LoanDetailHero'
import RefreshIcon from '~assets/svg/refresh.svg'
import ChevIcon from '~assets/svg/chev-right.svg'
import DetailItem from '~components/DetailItem'
import { LoanRoutes, MainNavigationProp, MainNavigationRouteProp } from '~types'
import { formatDate } from '~utils/date'
import { currencyFormatter } from '~utils/app-utils'
import { useGetLoanDetailAmortization } from '~api/loans'
import LoaderScreen from '~components/LoaderScreen'
import { TLoan } from './types'

interface Props {
  navigation: MainNavigationProp<LoanRoutes.Detail>
  route: MainNavigationRouteProp<LoanRoutes.Detail>
}

const LoanDetails = ({ navigation, route }: Props) => {
  const { loanDetail } = route.params

  const { data, isLoading, error } = useGetLoanDetailAmortization(
    loanDetail?.id,
  )

  if (isLoading) return <LoaderScreen />

  if (error) {
    navigation.goBack()
    return
  }
  const loan: TLoan = data?.data
  const currencyCode = loan?.currency_code
  const interestAmount = loan?.total_interest
    ? parseInt(loan?.total_interest)
    : 0
  const interestRate = loan?.rate ? parseFloat(loan?.rate) : '0'

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader
        onPress={() => navigation.navigate(LoanRoutes.All)}
        title="Loan details"
        close
      />
      <Box mt={'24px'}></Box>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <LoanDetailHero loanDetail={loan} />
        <Pressable
          flexDirection="row"
          alignItems="center"
          mt="40px"
          mb="20px"
          onPress={() =>
            navigation.navigate(LoanRoutes.Schedule, {
              loanSchedule: loan?.amortisation,
              currencyCode,
            })
          }>
          <RefreshIcon color="#62A446" />
          <Text color="green.50" fontSize="18px" flex={1} ml="8px">
            Loan Amortization Schedule
          </Text>
          <ChevIcon color="#62A446" />
        </Pressable>
        <Divider />
        <DetailItem label={'Loan type'} value={loan?.loan_type_type} />
        <DetailItem label={'Interest Rate'} value={`${interestRate}%`} />
        <DetailItem
          label={'Interest Amount'}
          value={currencyFormatter(interestAmount, currencyCode)}
        />
        <DetailItem label="Duration" value={`${loan?.duration} month(s)`} />
        <DetailItem
          label={'Start date'}
          value={formatDate(loanDetail?.start_date, 'shortMonth')}
        />

        <Text mt="20px">Reason</Text>
        <Text color="charcoal" mb={'20px'}>
          {loanDetail?.reason}
        </Text>
        <Box mb={'20px'} />
      </ScrollView>
    </Box>
  )
}

export default LoanDetails
