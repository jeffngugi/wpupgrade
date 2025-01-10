import React, { useState } from 'react'
import { Box } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import EwaReviewHeader from './components/EwaReviewHeader'
import EwaReviewCard from './components/EwaReviewCard'
import {
  EwaRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
  TNewSubmitData,
} from '../../types'
import { currencyWithCode } from '~utils/appUtils'
import { useMyProfile } from '~api/account'
import { upperCase } from 'lodash'
import { useApplyEWA } from '~api/ewa'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import SubmitButton from '~components/buttons/SubmitButton'
import { useSalaryAdvanceLoanSettings } from '~api/advance-loans'
import LoaderScreen from '~components/LoaderScreen'
import { queryClient } from '~ClientApp'
import { ewaQKeys } from '~api/QueryKeys'
import SuccessModal from '~components/modals/SuccessModal'

interface Props {
  navigation: MainNavigationProp<EwaRoutes.EwaReview>
  route: MainNavigationRouteProp<EwaRoutes.EwaReview>
}

const EwaReview = ({ route, navigation }: Props) => {
  const [successModal, setSuccessModal] = useState(false)
  const emp = useMyProfile()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const { mutate, isLoading } = useApplyEWA()
  const { data, isLoading: settingLoading } = useSalaryAdvanceLoanSettings()
  const currencyCode = emp?.data?.data?.currency_code
  let cacheId = 0
  let userPaymentCache = 0

  const {
    access_fee,
    access_fee_rate,
    amount_to_receive,
    transaction_charge,
    requested_amount,
  } = route.params.chargesData

  const submitData = route.params.submitData
  const amountToRecieve = currencyWithCode(
    currencyCode,
    amount_to_receive as string,
  )
  const transactionCharge = currencyWithCode(currencyCode, transaction_charge)
  const requestedAmount = currencyWithCode(
    currencyCode,
    requested_amount as string,
  )
  const accessFee = currencyWithCode(currencyCode, access_fee as string)

  const settingsData = data?.data?.settings?.data[0]

  const requireApproval =
    !!settingsData?.workpay_approval_required ||
    !!settingsData?.employer_approval_required

  const handleSubmitEwa = () => {
    const newSubmitData: TNewSubmitData = {
      ...submitData,
      v2: true,
      self_disburse: 1,
      selfservice: true,
      payment_method: upperCase(submitData.payment_method),
      employee_id,
    }
    newSubmitData['payment_method'] = upperCase(submitData.payment_method)
    newSubmitData['recipient_number']
    mutate(newSubmitData, {
      onSuccess: data => {
        if (requireApproval) {
          navigation.navigate(EwaRoutes.EwaSuccess, {
            formData: newSubmitData,
          })
          return
        }
        cacheId = data?.data?.payment_cache_id
        userPaymentCache = data?.data?.user_payment_cache_id
        const ewaId = data?.data?.advance?.id
        navigation.navigate(EwaRoutes.EwaOTP, {
          cacheId,
          newSubmitData,
          userPaymentCache,
          ewaId,
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(ewaQKeys.earnings)
      },
    })
  }

  const handleCloseSuccessModal = () => {
    queryClient.invalidateQueries(ewaQKeys.earnings)
    navigation.navigate(EwaRoutes.Ewa)
    setSuccessModal(false)
  }

  if (settingLoading) return <LoaderScreen />

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="Review payment"
        onPress={() => navigation.goBack()}
      />
      <EwaReviewHeader data={submitData} />
      <Box flex={1}>
        <EwaReviewCard label="Withdrawal Amount" value={requestedAmount} />
        <EwaReviewCard
          label={`Access Fee (${access_fee_rate ?? ''})`}
          value={accessFee}
        />
        <EwaReviewCard label="Transaction Charges" value={transactionCharge} />
        <EwaReviewCard label="Amount you receive" value={amountToRecieve} />
      </Box>

      <SuccessModal
        title={'EWA Request Successful'}
        message={
          'Your request is being processed. You will receive a notification once it has been approved.'
        }
        btnLabel={'Close'}
        onPressBtn={handleCloseSuccessModal}
        isOpen={successModal}
        onHide={handleCloseSuccessModal}></SuccessModal>
      <SubmitButton
        loading={isLoading}
        onPress={handleSubmitEwa}
        title="Send"
      />
    </Box>
  )
}

export default EwaReview
