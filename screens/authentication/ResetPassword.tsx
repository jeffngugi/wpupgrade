import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  ScrollView,
  Toast,
  useToast,
} from 'native-base'
import AuthHeader from './AuthHeader'
import { useForm } from 'react-hook-form'
import { AuthStackParamList } from '~types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import CommonInput from '~components/inputs/CommonInput'
import { useResetPassword } from '~api/auth'
import SuccessAlert from '~components/SuccessAlert'
import { FormattedMessage } from 'react-intl'
import SubmitButton from '~components/buttons/SubmitButton'

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>
type FormValues = {
  password: string
  password_confirmation: string
}

const ResetPassword = ({ route, navigation }: Props) => {
  const { control, handleSubmit, setError } = useForm<FormValues>()
  const { mutate, isLoading } = useResetPassword()
  const toast = useToast()

  const onSubmit = (data: FormValues) => {
    if (data?.password !== data?.password_confirmation) {
      setError('password_confirmation', {
        type: 'manual',
        message: 'Password mismatch',
      })
      return
    }
    const resetData = {
      token: route.params.code,
      ...data,
    }
    mutate(resetData, {
      onSuccess: data => {
        const description = data?.data?.message ?? 'Password succesfully reset'
        Toast.show({
          render: () => {
            return <SuccessAlert description={description} />
          },
          placement: 'top',
          top: 100,
          duration: 4000,
        })
        setTimeout(() => toast.closeAll(), 4000)
        navigation.navigate('Login')
      },
    })
  }
  return (
    <Box flex={1} safeArea paddingX={'20px'} background={'white'}>
      <Box flex={1} mt="19px">
        <AuthHeader onPress={() => navigation.goBack()} />
        <ScrollView>
          <Heading marginTop="24px">
            <FormattedMessage id="login.enter_pass" />
          </Heading>
          <CommonInput
            mt="24px"
            control={control}
            label="New Password"
            name="password"
            password
            rules={{
              required: { value: true, message: 'Password is required' },
            }}
          />
          <CommonInput
            control={control}
            mt="24px"
            label="Retype Password"
            name="password_confirmation"
            password
            rules={{
              required: { value: true, message: 'Password is required' },
            }}
          />
        </ScrollView>
      </Box>
      <Button
        marginBottom="32px"
        disabled={isLoading}
        height="48px"
        onPress={handleSubmit(onSubmit)}>
        <Text color="white" fontSize={'16px'} fontFamily={'heading'}>
          <FormattedMessage
            id={isLoading ? 'login.reseting' : 'login.set_pass'}
          />
        </Text>
      </Button>
    </Box>
  )
}

export default ResetPassword
