import React, { useState, useEffect } from 'react'
import { Box, Text, Button, Spinner } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import { useForm } from 'react-hook-form'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import DateInput from '~components/date/DateInput'
import { formatDate } from '~utils/date'
import { useEditEducation } from '~api/account'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const educationLevel = [
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'CPA', label: 'CPA' },
  { value: 'DIPLOMA', label: 'Diploma' },
  { value: 'DEGREE', label: 'Degree ' },
  { value: 'MASTERS', label: 'Masters ' },
  { value: 'DOCTORATE', label: 'Doctorate ' },
  { value: 'PROFESSOR', label: 'Professor ' },
]

type FormData = {
  education: string
  graduation_date: Date
}
const AddEducationScreen = ({ navigation }) => {
  const { mutate, isLoading } = useEditEducation()
  const { control, handleSubmit } = useForm()
  const [open, setOpen] = useState(false)
  const [education, setEducation] = useState('')
  const [items, setItems] = useState<optionsType[]>()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  useStatusBarBackgroundColor('white')

  const onSubmit = (data: FormData) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.add_education_details, {})
    const submitData = {
      education: data.education,
      graduation_date: formatDate(data.graduation_date, 'backend'),
      employee_id,
    }
    mutate(submitData, {
      onSuccess: () => {
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.add_education_details_success,
          {},
        )
        navigation.goBack()
      },
    })
  }

  return (
    <Box safeArea flex={1} backgroundColor="white" padding="16px">
      <Box flex={1}>
        <ScreenHeader
          close
          onPress={() => navigation.goBack()}
          title="Add education details"
        />
        <Box mt="24px" />
        <Text fontSize="14px" color="grey" fontFamily="body" mb="5px">
          Education level
        </Text>
        <DropDownPicker
          control={control}
          value={education}
          open={open}
          options={educationLevel}
          setOptions={setItems}
          setValue={setEducation}
          setOpen={setOpen}
          rules={{
            required: { value: true, message: 'Education is required' },
          }}
          name="education"
        />
        <Box marginY="10px" />
        <DateInput
          control={control}
          name="graduation_date"
          label="graduation date"
        />
      </Box>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Add"
        loading={isLoading}
      />
    </Box>
  )
}

export default AddEducationScreen
