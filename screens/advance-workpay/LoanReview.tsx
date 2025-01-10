import React, { useState } from 'react'
import { Box, Button, Spinner, Toast, Text } from 'native-base'
import LoanCalc from './components/LoanCalc'
import LoanCalcItem from './components/LoanCalcItem'
import ScreenHeader from '~components/ScreenHeader'
import InfoIcon from '~assets/svg/info.svg'
import RefreshIcon from '~assets/svg/refresh.svg'
import TimeIcon from '~assets/svg/clock-icon.svg'
import CalendarIcon from '~assets/svg/calendar.svg'
import PercentIcon from '~assets/svg/percent.svg'
import PrincipleIcon from '~assets/svg/payslip-icon.svg'
import { ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { AccountsRoutes, AdvanceLoanRoutes, LoanReviewParams } from '~types'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import ErrorAlert from '~components/ErrorAlert'
import LoaderScreen from '~components/LoaderScreen'
import { currencyFormatter } from '~utils/app-utils'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import _, { noop } from 'lodash'
import {
  useAdvanceLoanEditMutation,
  useGetAdvanceLoanDetail,
  useRequestAdvanceLoan,
} from '~api/advance-loans'
import { FileScrollView } from '~components/FilesScrollView'
import { useEmergencyContact, useMyProfile, useNextOfKin } from '~api/account'
import { TNextOfKin } from '~screens/account/ContactPersonScreen'
interface LoanReviewProps {
  navigation: any
  edit?: boolean
}

export interface LoanDetailParams {
  no_of_months: number | string | undefined
  currency_id: number | string | undefined
  principal: number | string | undefined
}

type SubmitPayload = {
  'employees_ids[]': string | number
  no_of_months: number | string | undefined
  start_date: string | undefined
  currency_id?: number | string | undefined
  principal?: number | string | undefined
  proof_of_residence?: any
  financial_statement?: any
  action?: string
  id?: string | number
}

const LoanReview = ({ navigation, edit = false }: LoanReviewProps) => {
  const route = useRoute()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const profileQuery = useMyProfile()
  const { data: profileData } = profileQuery
  const currencyId = profileData?.data?.currency_id ?? 1

  //check next of kin details
  const { data: nextOfKins, isLoading: nokLoading } = useNextOfKin()
  const nextOfKinDatas: TNextOfKin[] = nextOfKins?.data

  const [successModal, setSuccessModal] = useState(false)
  const [loanSuccessData, setLoanSuccessData] = useState({} as any)

  const reviewDetails: LoanReviewParams = route.params?.reviewDetails

  const isEdit = reviewDetails?.isEdit ?? false

  const detailParams: LoanDetailParams = {
    no_of_months: reviewDetails?.noOfMonths,
    currency_id: currencyId,
    principal: reviewDetails?.principal,
  }

  const { isLoading, data } = useGetAdvanceLoanDetail(detailParams)

  const loanIssueMutation = useRequestAdvanceLoan()
  const updateLoanMutation = useAdvanceLoanEditMutation()

  const onSubmit = () => {
    if (nextOfKinDatas?.length === 0) {
      Toast.show({
        render: () => {
          return (
            <ErrorAlert
              description={
                'Please add next of kin details in the account section'
              }
            />
          )
        },
        placement: 'top',
        top: 100,
        duration: 3000,
      })
      navigation.navigate(AccountsRoutes.ContactPerson)
      return
    }
    const payload: SubmitPayload = {
      'employees_ids[]': employee_id,
      no_of_months: reviewDetails?.noOfMonths,
      start_date: reviewDetails?.startDate,
      ..._.omit(reviewDetails, [
        'rate',
        'noOfMonths',
        'startDate',
        'amount',
        'proofOfResidenceFiles',
        'financialStatementFiles',
        'selectedLoanCategory',
        'isEdit',
        'itemId',
      ]),
      ...{
        currency_id: currencyId,
        principal: reviewDetails?.principal,
      },
    }
    if (reviewDetails?.proofOfResidenceFiles?.length) {
      payload['proof_of_residence'] =
        _.omit(reviewDetails?.proofOfResidenceFiles?.[0], [
          'amount',
          'category',
        ]) ?? {}
    }
    if (reviewDetails?.financialStatementFiles?.length) {
      payload['financial_statement'] =
        _.omit(reviewDetails?.financialStatementFiles?.[0], [
          'amount',
          'category',
        ]) ?? {}
    }
    // return
    if (isEdit) {
      const itemId = reviewDetails?.itemId
      const submitPayload = _.omit(payload, ['employees_ids[]', 'currency_id'])

      submitPayload['id'] = itemId
      submitPayload['action'] = 'update'
      if (itemId) {
        updateLoanMutation.mutate(
          { id: itemId, payload: submitPayload },
          {
            onSuccess: data => {
              setLoanSuccessData(data?.data?.data?.[0] ?? {})
              setSuccessModal(true)
              analyticsTrackEvent(
                AnalyticsEvents.AdvanceLoans.apply_for_advance_success,
                {},
              )
            },
            onError: error => {
              analyticsTrackEvent(
                AnalyticsEvents.AdvanceLoans.apply_for_advance_error,
                {},
              )
            },
          },
        )
      }
      return
    }
    loanIssueMutation.mutate(payload, {
      onSuccess: data => {
        setLoanSuccessData(data?.data?.data?.[0] ?? {})
        setSuccessModal(true)
        analyticsTrackEvent(
          AnalyticsEvents.AdvanceLoans.apply_for_advance_success,
          {},
        )
      },
      onError: error => {
        analyticsTrackEvent(
          AnalyticsEvents.AdvanceLoans.apply_for_advance_error,
          {},
        )
      },
    })
  }

  if (isLoading) return <LoaderScreen />

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader
        onPress={() => navigation.goBack()}
        title="Review Salary Advance"
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box mt={'24px'}></Box>
        <LoanCalc>
          <LoanCalcItem
            label={'Principal'}
            value={currencyFormatter(reviewDetails?.principal)}
            Icon={PrincipleIcon}
          />

          <LoanCalcItem
            label={'Monthly Interest'}
            value={reviewDetails?.rate}
            Icon={PercentIcon}
          />
          <LoanCalcItem
            label={'Number Of Months'}
            value={reviewDetails?.noOfMonths}
            Icon={CalendarIcon}
          />
          <LoanCalcItem
            label={'Start Date'}
            value={reviewDetails?.startDate}
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
        {reviewDetails?.proofOfResidenceFiles?.length ? (
          <>
            <Text mb="5px" mt={'12px'} color={'grey'}>
              Proof of Residence
            </Text>
            <Box mt="4px">
              <FileScrollView
                files={reviewDetails?.proofOfResidenceFiles ?? []}
                receipts={[]}
                setFiles={noop}
                setPrevReceipts={noop}
              />
            </Box>
          </>
        ) : null}
        {reviewDetails?.financialStatementFiles?.length ? (
          <>
            <Text mb="5px" mt={'12px'} color={'grey'}>
              Financial Statement
            </Text>
            <Box mt="4px">
              <FileScrollView
                files={reviewDetails?.financialStatementFiles ?? []}
                receipts={[]}
                setFiles={noop}
                setPrevReceipts={noop}
              />
            </Box>
          </>
        ) : null}
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
            {isEdit ? 'Save' : 'Apply'}
          </Text>
        )}
      </Button>
      <SuccessModal
        title={'Loan Application Successful'}
        message="You will receive a notification when your loan application is approved."
        btnLabel={'Back to module'}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.navigate(AdvanceLoanRoutes.Loan)
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
