import React from 'react'
import { Box, Button, ScrollView, Text, Toast } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import CommonInput from '../../components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import { TContactPerson, useAddEmergencyContact } from '~api/account'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import SuccessAlert from '~components/SuccessAlert'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const AddContactPersonScreen = ({ navigation }) => {
  const { control, handleSubmit } = useForm()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const { mutate, isLoading } = useAddEmergencyContact()
  useStatusBarBackgroundColor('white')

  const onSubmit = (data: Omit<TContactPerson, 'relationship'>) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.add_emergency_contact, {})
    const submitData = { ...data }
    submitData['employee_id'] = employee_id
    mutate(submitData, {
      onSuccess: (data: unknown) => {
        navigation.goBack()
        Toast.show({
          render: () => {
            return (
              <SuccessAlert
                description={data?.message ?? 'Contact added succesfully'}
              />
            )
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.add_emergency_contact_success,
          {},
        )
      },
    })
  }
  return (
    <Box flex={1} safeArea backgroundColor="white" padding="16px">
      <ScreenHeader
        title="Add emergency contact"
        onPress={() => navigation.goBack()}
        close
      />
      <Box mt="24px" />
      <ScrollView flex={1}>
        <CommonInput
          name="name"
          label="Full name"
          control={control}
          rules={{
            required: { value: true, message: 'Names are required' },
          }}
          my="10px"
        />
        <CommonInput
          name="contact"
          label="Phone number/Email address "
          control={control}
          my="10px"
          rules={{
            required: { value: true, message: 'Contant is required' },
          }}
        />
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Add"
        loading={isLoading}
      />
    </Box>
  )
}

export default AddContactPersonScreen
