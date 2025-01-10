import React from 'react'
import {
  Box,
  Text,
  Heading,
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
import { useForgotPassword } from '~api/auth'
import SuccessAlert from '~components/SuccessAlert'
import { FormattedMessage } from 'react-intl'
import ScreenHeader from '~components/ScreenHeader'
import { noop } from 'lodash'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>

export default function ForgotPasswordScreen({ navigation }: Props) {
  const toast = useToast()
  const handleBack = () => navigation.goBack()
  const { control, handleSubmit } = useForm()
  const { mutate, isLoading } = useForgotPassword()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const resetData = { email: data.email }
    mutate(resetData, {
      onSuccess: data => {
        const description =
          data?.data?.message ?? 'A recovery code sent to your email/phone'
        Toast.show({
          render: () => {
            return <SuccessAlert description={description} />
          },
          placement: 'top',
          top: 100,
          duration: 4000,
        })
        setTimeout(() => toast.closeAll(), 4000)
        navigation.navigate('VerificationCode')
      },
    })
  }

  useStatusBarBackgroundColor('white')

  return (
    <Box safeArea flex={1} paddingX="16px" background={'white'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box marginTop="19px" />
        <AuthHeader onPress={handleBack} />
        <Heading
          marginTop={'24px'}
          marginBottom={'12px'}
          fontSize="24px"
          color={'charcoal'}>
          <FormattedMessage id="forgot_pass.title" />
        </Heading>
        <Text fontSize={'16px'} color={'grey'}>
          <FormattedMessage id="forgot_pass.description" />
        </Text>
        <CommonInput
          control={control}
          label="Email/Phone"
          name="email"
          rules={{
            required: { value: true, message: 'Email/Phone is required' },
          }}
          mt="24px"
        />
      </ScrollView>
      <Button
        onPress={handleSubmit(onSubmit)}
        marginY="16px"
        mb={'32px'}
        disabled={isLoading}>
        <Text
          color="white"
          marginY="4px"
          fontSize={'16px'}
          fontFamily={'heading'}>
          {isLoading ? 'Loading' : 'Send code'}
        </Text>
      </Button>
    </Box>
  )
}
