import React, { useEffect } from 'react'
import { Box, Button, HStack, ScrollView, Spinner, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import CommonInput from '../../components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { TEditAddress, useEditAddress, useMyProfile } from '~api/account'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import SubmitButton from '~components/buttons/SubmitButton'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const EditAddressScreen = ({ navigation }) => {
  const { handleSubmit, control, setValue } = useForm()
  const { mutate, isLoading } = useEditAddress()
  const { data } = useMyProfile()
  const address = data?.data?.address
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  useStatusBarBackgroundColor('white')

  useEffect(() => {
    setValue('road', address?.road)
    setValue('postal_address', address?.postal_address)
    setValue('city', address?.city)
    setValue('zip_code', address?.zip_code)
  }, [])
  const onSubmit = (data: Omit<TEditAddress, 'emplyee_id'>) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.edit_address, {})
    const submitData = { ...data }
    submitData['employee_id'] = employee_id
    mutate(submitData, {
      onSuccess: () => {
        navigation.goBack()
        analyticsTrackEvent(AnalyticsEvents.Accounts.edit_address_success, {})
      },
    })
  }

  return (
    <Box
      safeArea
      flex={1}
      backgroundColor="white"
      paddingX="16px"
      paddingBottom={Platform.OS === 'android' ? '10px' : '0px'}>
      <ScreenHeader title="Edit address" onPress={() => navigation.goBack()} />
      <Box mt="24px" />
      <ScrollView flex={1}>
        <CommonInput
          label="Street/road name"
          name="road"
          control={control}
          marginY="10px"
        />
        <CommonInput
          label="Postal adress"
          name="postal_address"
          control={control}
          marginY="10px"
        />
        <HStack justifyContent="space-between" marginY="10px">
          <Box width="48%">
            <CommonInput label="City" name="city" control={control} />
          </Box>
          <Box width="48%">
            <CommonInput
              label="Zip/postal code"
              name="zip_code"
              control={control}
            />
          </Box>
        </HStack>
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Save"
        loading={isLoading}
      />
    </Box>
  )
}

export default EditAddressScreen
