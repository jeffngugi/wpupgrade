import React, { useState } from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import {
  Box,
  Button,
  HStack,
  Pressable,
  Spinner,
  Text,
  useToast,
} from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import { useForm } from 'react-hook-form'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import {
  useConfirmOTP,
  useCreateRecurringTransfer,
  useDisable2FASecurity,
  useGetWalletUser,
  useSend2FactorAuthOTP,
} from '~api/wallet'
import TextAreaInput from '~components/inputs/TextAreaInput'
import CommonInput from '~components/inputs/CommonInput'
import { noop } from 'lodash'
import { walletQKeys } from '~api/QueryKeys'
import { queryClient } from '~ClientApp'

type TransferCategory = {
  user_uuid?: string

  name?: string | undefined
  color_code?: string | undefined
  description?: string | undefined
}

type Props = {
  isOpen: boolean
  hideModal: () => void
  isSMSVerificationEnabled?: boolean
}

const SMSModal = (p: Props) => {
  const { control, handleSubmit, setValue, reset, setError } = useForm()
  const [otpError, setOtpError] = useState<string | undefined>()
  const { data: walletUser } = useGetWalletUser()
  const { mutate, isLoading } = useSend2FactorAuthOTP()
  const { mutate: mutateConfirm, isLoading: loadingConfirm } = useConfirmOTP()
  const { mutate: mutateDisable2FA, isLoading: loadingDisable2FA } =
    useDisable2FASecurity()
  const mutateFn = p.isSMSVerificationEnabled ? mutateDisable2FA : mutateConfirm

  const toast = useToast()

  const resendOTP = () => {
    mutate(
      { user_uuid: walletUser?.data?.uuid },
      {
        onSuccess: () => {
          toast.show({
            title: 'OTP sent successfully',
            placement: 'top',
          })
        },
      },
    )
  }

  const onSubmit = data => {
    const submitData = {
      ...data,
      user_uuid: walletUser?.data?.uuid,
      action: 'SMS',
    }

    mutateFn(submitData, {
      onSuccess: data => {
        p.hideModal()

        toast.show({
          title: '2-FA enabled successfully',
          placement: 'top',
        })
        setTimeout(() => {
          queryClient.invalidateQueries(walletQKeys.notificationSettings)
        }, 1000)
        reset()
      },
      onError: error => {
        if (error?.response?.data?.message) {
          setError('otp', {
            message: error?.response?.data?.message,
          })
        }
      },
    })
  }

  return (
    <SwipableModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box px="16px" flex={1} top="-20">
        <HStack alignItems="center" mb="12px">
          <Text
            color="#253545"
            fontSize="20px"
            lineHeight="30px"
            mr={'auto'}
            fontFamily="heading">
            SMS Verification
          </Text>
          <Pressable onPress={p.hideModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        <Box mb="12px">
          <Text
            color="#253545"
            fontSize="16px"
            lineHeight="30px"
            fontFamily="body">
            Please enter the OTP sent to your phone number
          </Text>
        </Box>

        <CommonInput
          control={control}
          label="Enter OTP"
          name="otp"
          placeholder="OTP"
          rules={{
            required: { value: true, message: 'OTP is required' },
          }}
          my="14px"
        />
        <Pressable onPress={resendOTP}>
          {isLoading ? (
            <Spinner color={'white'} />
          ) : (
            <Text
              color="green.50"
              fontSize="14px"
              lineHeight="30px"
              fontFamily="body">
              Resend OTP
            </Text>
          )}
        </Pressable>

        <Button
          isLoading={loadingConfirm || loadingDisable2FA}
          mt="50px"
          mb="20px"
          _text={{ color: 'white', fontSize: '16px' }}
          onPress={handleSubmit(onSubmit)}>
          {p.isSMSVerificationEnabled ? ' Disable 2-FA' : ' Enable 2-FA'}
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default SMSModal
