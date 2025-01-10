import React, { useEffect, useState } from 'react'
import { Box, ScrollView, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { Button } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import { useRequestAdvance } from '~api/advance'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import SubmitButton from '~components/buttons/SubmitButton'
import { Platform, StatusBar } from 'react-native'
import format from 'date-fns/format'

const ApplyAdvance = ({ navigation }) => {
  const { control, handleSubmit, setValue } = useForm()
  const { mutate, isLoading } = useRequestAdvance()
  const [successModal, setSuccessModal] = useState(false)
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const currentMonth = format(new Date(), 'MMMM')
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#fff')
  }, [navigation])

  useEffect(() => {
    setValue('remarks', `${currentMonth} Salary Advance`)
  }, [])

  const onSubmit = (data: any) => {
    const submitData = { ...data }
    submitData['employee_id'] = employee_id
    mutate(submitData, {
      onSuccess: () => {
        setSuccessModal(true)
      },
    })
  }
  return (
    <Box safeArea flex={1} bgColor="white" px="12px">
      <ScreenHeader
        close
        onPress={() => navigation.goBack()}
        title="New salary advance"
      />
      <ScrollView flex={1}>
        <Box height={'24px'} />
        <CommonInput
          name="amount"
          control={control}
          label="Amount"
          keyboardType="numeric"
          rules={{
            required: {
              value: true,
              message: 'Amount is required',
            },
          }}
        />
        <Box my="20px">
          <DateInput
            control={control}
            name="start_date"
            mode="date"
            label="Date of issue"
            rules={{
              required: {
                value: true,
                message: 'Date is required',
              },
            }}
          />
        </Box>
        <TextAreaInput name="remarks" control={control} label="Notes" />
      </ScrollView>

      <SubmitButton onPress={handleSubmit(onSubmit)} title="Apply" />
      <SuccessModal
        title={'Application Successful'}
        message="You will receive a notification when your salary advance application is successful"
        btnLabel={'Back to module'}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.goBack()
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal message={'Submitting application'} isVisible={isLoading} />
    </Box>
  )
}

export default ApplyAdvance
