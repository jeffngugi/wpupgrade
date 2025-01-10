import React from 'react'
import { Box, Text, Button, Spinner, Toast, ScrollView } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import CommonInput from '../../components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import { TContactPerson, useAddNextOfKin } from '~api/account'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import SuccessAlert from '~components/SuccessAlert'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { AnalyticsEvents } from '~utils/analytics/events'
import { analyticsTrackEvent } from '~utils/analytics'

const AddNextOfKin = ({ navigation }: { navigation: unknown }) => {
  const { control, handleSubmit } = useForm()

  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const { mutate, isLoading } = useAddNextOfKin()
  useStatusBarBackgroundColor('white')

  const onSubmit = (data: TContactPerson) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.add_next_of_kin, {})
    const submitData = { ...data }
    submitData['employee_id'] = employee_id
    mutate(submitData, {
      onSuccess: (data: unknown) => {
        navigation.goBack()
        Toast.show({
          render: () => {
            return (
              <SuccessAlert
                description={
                  data?.message ? data.message : 'Contact added succesfully'
                }
              />
            )
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.add_next_of_kin_success,
          {},
        )
      },
    })
  }
  return (
    <Box flex={1} safeArea backgroundColor="white" padding="16px">
      <ScreenHeader
        title="Add next of Kin"
        onPress={() => navigation.goBack()}
        close
      />
      <ScrollView flex={1}>
        <Box mt="14px" />
        <CommonInput
          name="name"
          label="Full name"
          control={control}
          rules={{
            required: { value: true, message: 'Name is required' },
          }}
          my="10px"
        />
        <CommonInput
          name="relationship"
          label="Relationship"
          control={control}
          my="10px"
          rules={{
            required: { value: true, message: 'Relationship is required' },
          }}
        />
        <CommonInput
          name="contact"
          label="Phone number/Email address "
          control={control}
          rules={{
            required: { value: true, message: 'Contant is required' },
          }}
          my="10px"
        />
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        title="Add"
      />
    </Box>
  )
}

export default AddNextOfKin
