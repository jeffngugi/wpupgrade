import { Box, Button, ScrollView, Text, Toast } from 'native-base'
import React, { useEffect } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '../../components/inputs/CommonInput'
import { TContactPerson, useEditEmergencyContact } from '~api/account'
import SuccessAlert from '~components/SuccessAlert'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'

const EditContactPersonScreen = ({ route, navigation }) => {
  const { control, setValue, handleSubmit } = useForm()
  const { mutate, isLoading } = useEditEmergencyContact()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const { emergencyContant } = route.params
  useEffect(() => {
    setValue('name', emergencyContant?.name ?? '')
    setValue('contact', emergencyContant?.contact ?? '')
  }, [])
  useStatusBarBackgroundColor('white')
  const onSubmit = (data: Omit<TContactPerson, 'relationship'>) => {
    const formData = { ...data }
    const id: string = emergencyContant.id
    formData['employee_id'] = employee_id

    const payload = { formData, id }
    mutate(payload, {
      onSuccess: (data: unknown) => {
        navigation.goBack()
        Toast.show({
          render: () => {
            return (
              <SuccessAlert
                description={
                  data?.message ? data.message : 'Edit was succesful'
                }
              />
            )
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
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
        />
        <CommonInput
          name="contact"
          label="Phone number/Email address "
          control={control}
          my="20px"
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

export default EditContactPersonScreen
