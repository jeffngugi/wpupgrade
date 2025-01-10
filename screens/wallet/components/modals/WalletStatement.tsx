import React, { useState } from 'react'
import { Box } from 'native-base'
import SuccessModal from '~components/modals/SuccessModal'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import SubmitButton from '~components/buttons/SubmitButton'
import ScreenHeader from '~components/ScreenHeader'
import { useExportWalletStatement } from '~api/wallet'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import WarningModal from '~components/modals/WarningModal'
import { AxiosError } from 'axios'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.WalletStatements>
  route: MainNavigationRouteProp<WalletRoutes.WalletStatements>
}

const WalletStatement = ({ navigation }: Props) => {
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { control, handleSubmit, watch } = useForm()
  const { mutate, isLoading } = useExportWalletStatement()

  const startDate = watch('start_date')
  const endDate = watch('end_date')

  const onSubmit = data => {
    const customSuccessMessage =
      'The wallet statement has been generated, and will be emailed to you on completion.'
    mutate(data, {
      onSuccess: data => {
        setSuccess(true)
        setSuccessMessage(data?.data?.message ?? customSuccessMessage)
      },
      onError: (error: AxiosError<unknown, any>) => {
        setFailed(true)
        const errorMsg =
          error.response?.data?.message ??
          'No transactions found for the selected period.'
        setErrorMessage(errorMsg)
      },
    })
  }

  return (
    <Box padding="16px" flex={1}>
      <ScreenHeader
        close
        title="Export wallet statement"
        onPress={() => navigation.goBack()}
      />
      <Box flex={1} paddingY="16px">
        <DateInput
          control={control}
          name="start_date"
          label="Start Date"
          rules={{
            required: { value: true, message: 'Start date is required' },
          }}
          maximumDate={endDate ?? new Date()}
        />
        <Box my="8px" />
        <DateInput
          control={control}
          name="end_date"
          label="End Date"
          maximumDate={new Date()}
          minimumDate={startDate ? startDate : undefined}
          rules={{
            required: { value: true, message: 'End date is required' },
          }}
        />
      </Box>
      <SubmitButton
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        title="Export"></SubmitButton>
      <SuccessModal
        title="Processing"
        message={successMessage}
        btnLabel="OK"
        onPressBtn={() => navigation.goBack()}
        isOpen={success}
        onHide={() => setSuccess(false)}
      />
      <WarningModal
        title="Failed to process"
        description={errorMessage}
        isVisible={failed}
        hideModal={() => setFailed(false)}
      />
    </Box>
  )
}

export default WalletStatement
