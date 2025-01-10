import React, { useEffect } from 'react'
import { Box, Button, Spinner, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '../../components/inputs/CommonInput'
import { Platform } from 'react-native'
import { emailRegex } from '~utils/regex'
import { useMyProfile, useUpdateEmail } from '~api/account'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import { isNil } from 'lodash'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

type FormValues = {
  personal_email: string
}

const EditEmailScreen = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm({ mode: 'all' })
  const { data } = useMyProfile()
  const email = data?.data?.address?.personal_email
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  useStatusBarBackgroundColor('white')

  useEffect(() => {
    setValue('personal_email', email)
  }, [])

  const { mutate, isLoading } = useUpdateEmail()
  const onSubmit = (data: FormValues) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.edit_personal_email, {})
    const submitData = {
      personal_email: data.personal_email,
      employee_id,
    }
    mutate(submitData, {
      onSuccess: () => {
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.edit_personal_email_success,
          {},
        )
        navigation.goBack()
      },
    })
  }
  return (
    <Box
      flex={1}
      safeArea
      paddingX="16px"
      backgroundColor="white"
      paddingBottom={Platform.OS === 'android' ? '20px' : '10px'}>
      <ScreenHeader
        title="Edit personal email"
        onPress={() => navigation.goBack()}
      />
      <Box flex={1} mt={'24px'}>
        <CommonInput
          label="Email address"
          control={control}
          name="personal_email"
          rules={{
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: emailRegex,
              message: 'Email is invalid',
            },
          }}
        />
      </Box>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Save"
        loading={isLoading}
      />
    </Box>
  )
}

export default EditEmailScreen
