import { Box, Button, ScrollView, Text, Toast } from 'native-base'
import React, { useEffect } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '../../components/inputs/CommonInput'
import { TContactPerson, useEditNextOfKin } from '~api/account'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import SuccessAlert from '~components/SuccessAlert'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const EditNextOfKin = ({ route, navigation }) => {
  const { control, setValue, handleSubmit } = useForm()
  const { nextOfKin } = route.params
  const { mutate, isLoading } = useEditNextOfKin()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  useStatusBarBackgroundColor('white')

  useEffect(() => {
    setValue('relationship', nextOfKin?.relationship ?? '')
    setValue('name', nextOfKin?.name ?? '')
    setValue('contact', nextOfKin?.contact ?? '')
  }, [])

  const onSubmit = (data: TContactPerson) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.edit_next_of_kin, {})
    const id: string = nextOfKin?.id
    const formData = { ...data }
    formData['employee_id'] = employee_id
    const payload = {
      formData,
      id,
    }
    mutate(payload, {
      onSuccess: (data: unknown) => {
        navigation.goBack()
        Toast.show({
          render: () => {
            return (
              <SuccessAlert
                description={
                  data?.message ? data.message : 'Edit was successful'
                }
              />
            )
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.edit_next_of_kin_success,
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
        <CommonInput
          name="name"
          label="Full name"
          control={control}
          my="10px"
        />
        <CommonInput
          name="relationship"
          label="Relationship"
          control={control}
          my="10px"
        />
        <CommonInput
          name="contact"
          label="Phone number/Email address "
          control={control}
          my="10px"
        />
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Save"
        loading={isLoading}
      />
    </Box>
  )
}

export default EditNextOfKin
