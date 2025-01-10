import React, { Dispatch, useState } from 'react'

import { Box, Text, Button, Heading, ScrollView } from 'native-base'
import { useForm } from 'react-hook-form'
import { LoginScreenProps } from '../../types'
import { useloginMutation } from '~api/auth'

import CommonInput from '~components/inputs/CommonInput'
import { FormattedMessage } from 'react-intl'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import DeveloperTools from '~components/DeveloperTools'
import { useDispatch, useSelector } from 'react-redux'
import { ApplicationAction, State, UserAction } from '~declarations'
import { loginUser } from '~store/actions/User'
import { setItem } from '~storage/device-storage'
import { appLock } from '~store/actions/Application'

type FormValues = {
  email: string
  password: string
}

type SubmitData = FormValues & { is_mobile: number; skipPinScreen?: boolean }

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [show, setShow] = useState<boolean>(false)
  const { control, handleSubmit } = useForm<FormValues>()
  const { mutate, isLoading, error } = useloginMutation()
  const dispatch: Dispatch<UserAction | ApplicationAction> = useDispatch()

  const { lockPinAvailable, lockingEnabled } = useSelector(
    (state: State) => state.application,
  )

  const skipPinScreen = lockPinAvailable && !lockingEnabled

  const onSubmit = (data: FormValues) => {
    const submitData: SubmitData = { ...data, is_mobile: 1, skipPinScreen }
    // moving on success here to use selector data
    mutate(submitData, {
      onSuccess: async data => {
        const user = {
          id: data?.data?.id,
          token: data?.data?.auth_token,
          employee_id: data?.data?.employee_id,
          company_id: data?.data?.company_id,
        }
        const skipPinScreen = lockPinAvailable && !lockingEnabled
        if (!skipPinScreen) {
          dispatch(appLock())
        }
        await dispatch(loginUser(user))
        await setItem('userData', user)
      },
    })
    analyticsTrackEvent(AnalyticsEvents.Auth.sign_in, {
      email: data.email,
    })
  }

  return (
    <Box flex={1} safeArea paddingX={'20px'} background={'white'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading
          marginTop="16px"
          justifyContent={'center'}
          background={'amber.100'}
          fontSize={'24px'}
          color={'charcoal'}>
          <FormattedMessage id="login.title" />
        </Heading>
        <Box mt={'12px'}>
          <Text fontSize={'16px'} color={'grey'}>
            Please enter the login credentials sent to you by your admin
          </Text>
        </Box>
        <Box mt={'32px'} />
        <CommonInput
          control={control}
          label="Email/Phone"
          name="email"
          rules={{
            required: { value: true, message: 'Email/Phone is required' },
          }}
          mb="10px"
          inputProps={{
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoComplete: 'email',
            autoCorrect: false,
          }}
        />
        <CommonInput
          control={control}
          label="Password"
          name="password"
          password
          rules={{
            required: { value: true, message: 'Password is required' },
          }}
          my="10px"
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          marginTop="32px"
          disabled={isLoading}>
          <Text
            color="white"
            marginY="4px"
            fontFamily={'heading'}
            fontSize={'16px'}>
            {isLoading ? 'Logging in ...' : 'Log In'}
          </Text>
        </Button>
        <Button
          onPress={() => navigation.navigate('ForgotPassword')}
          marginTop={'24px'}
          variant="url">
          <Text fontSize={'16px'} color={'green.50'}>
            <FormattedMessage id="login.forgot" />?
          </Text>
        </Button>
      </ScrollView>
      {process.env.NODE_ENV === 'production' ? null : <DeveloperTools />}
    </Box>
  )
}
