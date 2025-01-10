import React from 'react'
import { Box, Button, ScrollView, Text, Toast, Spinner } from 'native-base'
import AuthHeader from '../authentication/AuthHeader'
import CommonInput from '../../components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import { TChangePassword, useChangePassword } from '~api/account'
import { deleteItem } from '~storage/device-storage'
import { logoutUser } from '~store/actions/User'
import { queryClient } from '~ClientApp'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { UserAction } from '~declarations'
import SuccessAlert from '~components/SuccessAlert'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import ScreenHeader from '~components/ScreenHeader'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const AccountPasswordScreen = ({ navigation }) => {
  const { control, handleSubmit, setError } = useForm()
  const dispatch: Dispatch<UserAction> = useDispatch()
  const { mutate, isLoading } = useChangePassword()

  useStatusBarBackgroundColor('white')

  const handleSuccessChange = async () => {
    await deleteItem('userData')
    await dispatch(logoutUser())
    queryClient.removeQueries()
  }

  const onSubmit = (data: TChangePassword) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.change_password, {})
    if (data.new_password !== data.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Password mis-match',
      })
      return
    }
    mutate(data, {
      onSuccess: data => {
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.change_password_success,
          {},
        )
        handleSuccessChange()
        Toast.show({
          render: () => {
            return <SuccessAlert description={data?.message ?? ''} />
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
      },
    })
  }

  return (
    <Box flex={1} safeArea paddingX={'20px'} background={'white'}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Change Password"
          onPress={() => navigation.goBack()}
        />

        <Box mt="24px" />
        <CommonInput
          label="Old Password"
          name="old_password"
          control={control}
          rules={{
            required: { value: true, message: 'Current password is required' },
          }}
        />
        <CommonInput
          label="New Password"
          name="new_password"
          my="12px"
          control={control}
          password
          rules={{
            required: { value: true, message: 'Password is required' },
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          }}
        />
        <CommonInput
          label="Retype password"
          name="confirm_password"
          control={control}
          password
          rules={{
            required: { value: true, message: 'Kindly retype the password' },
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          }}
        />
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Change Password"
        loading={isLoading}
      />
    </Box>
  )
}

export default AccountPasswordScreen
