import React, { useEffect, useState } from 'react'
import { Box, Button, ScrollView, Spacer, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import DateInput from '../../components/date/DateInput'
import { useForm } from 'react-hook-form'
import CommonInput from '../../components/inputs/CommonInput'
import LoadingModal from '../../components/modals/LoadingModal'
import SuccessModal from '../../components/modals/SuccessModal'
import { TCreateOvertime, useCreateOvertime } from '~api/overtime'
import { dateToString } from '~utils/date'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import { OvertimeRoutes } from '~types'
import TextAreaInput from '~components/inputs/TextAreaInput'
import SubmitButton from '~components/buttons/SubmitButton'

const OvertimeEdit = ({ navigation }) => {
  const [success, setSuccess] = useState(false)
  const { mutate, isLoading } = useCreateOvertime()
  const { control, handleSubmit } = useForm()
  const [item, setItem] = useState({})
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const onSubmit = (data: TCreateOvertime) => {
    const formData = {
      date: dateToString(data.date, 'yyyy-M-d'),
      time_from: dateToString(data.time_from, 'HH:mm'),
      hours: data.hours,
      notes: data.notes ?? '',
      employee_id,
    }
    mutate(formData, {
      onSuccess: () => {
        setSuccess(true)
      },
    })
  }

  const handleReview = () => {
    setSuccess(false)
    navigation.goBack()
  }
  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <Box mt={'0px'} mb={'12px'}>
          <DateInput
            control={control}
            name="date"
            mode="date"
            label="Date"
            rules={{
              required: { value: true, message: 'Date is required' },
            }}
          />
        </Box>
        <Box my={'12px'}>
          <DateInput
            control={control}
            name="time_from"
            mode="time"
            label="Start time"
            rules={{
              required: { value: true, message: 'Start time is required' },
            }}
          />
        </Box>
        <CommonInput
          control={control}
          name="hours"
          my="12px"
          label="Number of hours worked"
          keyboardType="numeric"
          rules={{
            required: { value: true, message: 'Hours worked required' },
          }}
        />
        <Box my={'12px'}>
          <TextAreaInput label="reason" name="notes" control={control} />
        </Box>
      </ScrollView>

      <SubmitButton title="Save" onPress={handleSubmit(onSubmit)} />
      <LoadingModal
        message="Submiting overtime request"
        isVisible={isLoading}
      />
      <SuccessModal
        title="Overtime request successful"
        message="You will receive a notification when your overtime request is approved."
        btnLabel="Back to module"
        onPressBtn={handleReview}
        isOpen={success}
        onHide={() => setSuccess(false)}
      />
    </Box>
  )
}

export default OvertimeEdit
