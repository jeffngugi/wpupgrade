import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import { Box, Button, Text } from 'native-base'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'

const AttendanceDownload = ({ navigation }) => {
  const { handleSubmit, control } = useForm()
  const onSubmit = data => {
    console.log('Your downloading data from ', data)
  }
  useStatusBarBackgroundColor('white')
  return (
    <ScreenContainer>
      <ScreenHeader
        onPress={() => navigation.goBack()}
        title="Download Report"
      />
      <Box flex={1} mt={'24px'}>
        <DateInput name="start_date" control={control} label="Start Date" />
        <Box height={'24px'} />
        <DateInput name="end_date" control={control} label="End Date" />
      </Box>

      <SubmitButton onPress={handleSubmit(onSubmit)} title="Download report" />
    </ScreenContainer>
  )
}

export default AttendanceDownload
