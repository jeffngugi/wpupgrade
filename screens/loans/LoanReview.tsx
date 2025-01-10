import React, { useState } from 'react'
import { Box, Button, Spinner, Text } from 'native-base'
import LoanCalc from './components/LoanCalc'
import LoanCalcItem from './components/LoanCalcItem'
import ScreenHeader from '~components/ScreenHeader'
import InfoIcon from '~assets/svg/info.svg'
import RefreshIcon from '~assets/svg/refresh.svg'
import TimeIcon from '~assets/svg/clock-icon.svg'
import CalendarIcon from '~assets/svg/calendar.svg'
import PercentIcon from '~assets/svg/percent.svg'
import PrincipleIcon from '~assets/svg/payslip-icon.svg'
import LoanIcon from '~assets/svg/loan-icon.svg'
import LoanSourceIcon from '~assets/svg/loan-source.svg'
import { ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { useGetLoanDetail, useLoanIssueMutation } from '~api/loans'
import { LoanRoutes } from '~types'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import LoaderScreen from '~components/LoaderScreen'
import { currencyFormatter } from '~utils/app-utils'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import { isFeatureEnabled, useMenuItems } from '~utils/hooks/useMenuItems'
import { omit } from 'lodash'

const LoanReview = ({ navigation }) => {
  const route = useRoute()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const [successModal, setSuccessModal] = useState(false)
  const [loanSuccessData, setLoanSuccessData] = useState({} as any)
  const { enabledFeatures } = useMenuItems()

  const { reviewDetails } = route.params

  const isWorkpayFunded = isFeatureEnabled(
    'workpay_funded_employee_loans',
    enabledFeatures,
  )

  const fundingSource = isWorkpayFunded ? 'Workpay' : 'Company'

  const detailParams = {
    no_of_months: reviewDetails?.noOfMonths,
    type: reviewDetails.type,
    rate: reviewDetails?.rate,
    principal: reviewDetails?.principal,
  }

  const { isLoading, data } = useGetLoanDetail(detailParams)
  const loanIssueMutation = useLoanIssueMutation()

  const onSubmit = () => {
    const payload = {
      ...reviewDetails,
      employees_ids: [employee_id],
      loan_type_id: reviewDetails?.selectedLoanCategory,
      type: reviewDetails?.type,
      no_of_months: reviewDetails?.noOfMonths,
      start_date: moment(reviewDetails?.startDate).format('YYYY-MM-DD'),
      employee_id,
    }

    const newPayload = omit(payload, [
      'noOfMonths',
      'startDate',
      'selectedLoanCategory',
    ])

    const submitData: {
      payload: any
      isWorkpayFunded: boolean
    } = { payload: newPayload, isWorkpayFunded }

    loanIssueMutation.mutate(submitData, {
      onSuccess: data => {
        setLoanSuccessData(data?.data?.data?.[0] ?? {})
        setSuccessModal(true)
        analyticsTrackEvent(AnalyticsEvents.Loans.apply_loan_success, {})
      },
      onError: error => {
        analyticsTrackEvent(AnalyticsEvents.Loans.apply_loan_failure, {})
      },
    })
  }

  if (isLoading) return <LoaderScreen />

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Review loan" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box mt={'24px'}></Box>
        <LoanCalc>
          <LoanCalcItem
            label={'Funding Source'}
            value={fundingSource}
            Icon={LoanSourceIcon}
          />
          <LoanCalcItem
            label={'Principal amount'}
            value={currencyFormatter(reviewDetails?.principal)}
            Icon={PrincipleIcon}
          />
          <LoanCalcItem
            label={'Loan Type'}
            value={reviewDetails?.type}
            Icon={LoanIcon}
          />
          <LoanCalcItem
            label={'Monthly Interest'}
            value={`${reviewDetails?.rate}%`}
            Icon={PercentIcon}
          />
          <LoanCalcItem
            label={'Number Of Months'}
            value={reviewDetails?.noOfMonths}
            Icon={CalendarIcon}
          />
          <LoanCalcItem
            label={'Start Date'}
            value={moment(reviewDetails?.startDate).format('YYYY/MM/DD')}
            Icon={TimeIcon}
          />
        </LoanCalc>
        <Box mt="8px">
          <LoanCalc>
            <LoanCalcItem
              label="Monthly contribution"
              Icon={InfoIcon}
              value={`${
                currencyFormatter(data?.data?.monthly_installments) ?? '-'
              } `}
            />
            <LoanCalcItem
              label="Total repayment"
              Icon={RefreshIcon}
              value={`${currencyFormatter(data?.data?.total_amount) ?? '-'} `}
            />
          </LoanCalc>
        </Box>
      </ScrollView>
      <Button style={{ marginBottom: 20 }} onPress={onSubmit}>
        {loanIssueMutation.isLoading ? (
          <Spinner color="white" />
        ) : (
          <Text
            color="white"
            marginY="2px"
            fontFamily={'heading'}
            fontSize="16px">
            Apply
          </Text>
        )}
      </Button>
      <SuccessModal
        title={'Loan Application Successful'}
        message="You will receive a notification when your loan application is approved."
        btnLabel={'Back to Loans'}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.navigate(LoanRoutes.Loan)
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal
        message="Submitting loan application"
        isVisible={loanIssueMutation.isLoading}
      />
    </Box>
  )
}

export default LoanReview
