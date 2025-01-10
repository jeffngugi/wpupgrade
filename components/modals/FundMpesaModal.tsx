import React, { useEffect, useRef, useState } from 'react'
import SwipableModal from './SwipableModal'
import { Box, HStack, Text, Button } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import CheckIcon from '~assets/svg/green-check.svg'
import XIcon from '~assets/svg/wallet-x.svg'
import { Pressable } from 'react-native'
import { useFundWallet, useGetWalletUser } from '~api/wallet'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import { useNavigation } from '@react-navigation/native'
import SubmitButton from '~components/buttons/SubmitButton'
import PhoneField from '~components/inputs/PhoneField'
import PhoneInput from 'react-native-phone-number-input'
import { useFetchProfile } from '~api/home'
import { parsePhoneNumber } from 'libphonenumber-js'

type Props = {
  isOpen: boolean
  hideModal: () => void
  amount: string
  setMpesaReference?: (reference: string) => void
  isPolling?: boolean
  isForm: boolean
  setIsForm: (isForm: boolean) => void
  title?: string
  successMsg?: string
  setTitle: (title: string) => void
  setSuccessMsg: (successMsg: string) => void
  confirmPayment: () => void
}

const FundMpesaModal = (p: Props) => {
  const {
    setMpesaReference,
    isForm,
    setIsForm,
    title,
    successMsg,
    setTitle,
    setSuccessMsg,
    confirmPayment,
  } = p
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    setError,
    reset,
  } = useForm()

  const phoneRef = useRef<PhoneInput>(null)

  const { data } = useGetWalletUser()
  const { data: profileInfo, isLoading: loading } = useFetchProfile()
  const country = profileInfo?.data?.country_code ?? ''
  const countryPhoneinputCode = country.slice(0, 2)

  useEffect(() => {
    if (!loading) {
      const phoneNo = data?.data?.profile?.phone
      const phoneNumber = parsePhoneNumber(phoneNo, countryPhoneinputCode)

      reset({
        phone_number: phoneNumber?.nationalNumber,
      })
    }
  }, [loading])

  const { mutate, isLoading } = useFundWallet()
  const wallet = data?.data?.wallets?.[0]

  const closeModal = () => {
    p.hideModal()
    setIsForm(true)
  }

  const handleBtnClick = () => {
    confirmPayment()
  }

  const onSubmit = (data: { phone_number: any }) => {
    if (phoneRef.current?.isValidNumber(data.phone_number) === false) {
      setError('phone', {
        message: 'Phone number is invalid',
      })

      return
    }

    const mobileNumber = `${phoneRef.current?.getCallingCode()}${
      data.phone_number
    }`

    const submitData = {
      wallet_id: wallet.uuid,
      amount: p.amount,
      payment_method: 'MPESA',
      phone_number: mobileNumber,
    }

    mutate(submitData, {
      onSuccess: data => {
        setIsForm(false)
        if (data?.success) {
          setTitle('Request successful')
          setSuccessMsg(
            data?.message ??
              'Kindly complete the request for the transaction to be successful.',
          )
          setMpesaReference?.(data?.data?.reference)
          queryClient.invalidateQueries([
            walletQKeys.transactions,
            walletQKeys.user,
          ])
        } else {
          setTitle('Request failed')
          setSuccessMsg(
            data?.message ??
              'Your transaction could not be handled at this moment. Please try again later',
          )
        }
      },
      // onError: error => {
      //   console.log('This is the error message', error?.response?.data)
      // },
    })
  }

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      {/* <ModalHandle style={{ top: -20, position: 'relative' }} /> */}
      <Box paddingX="16px" paddingBottom="30px" top="-20px">
        <HStack mb="40px" alignItems="center" justifyContent="space-between">
          <Text color="charcoal" fontSize="20px" lineHeight="30px">
            Fund via Mpesa
          </Text>
          <Pressable onPress={closeModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        {isForm ? (
          <Box>
            <PhoneField
              control={control}
              name="phone_number"
              error={isDirty ? errors.phone : undefined}
              ref={phoneRef}
              defaultCode={countryPhoneinputCode ?? 'KE'}
              placeholder="Phone #"
              containerStyle={{
                width: '100%',
                borderRadius: 4,
              }}
              disabled={false}
              rules={{
                required: 'Phone number is required',
              }}
            />
          </Box>
        ) : (
          <Box>
            <CheckIcon />
            <Text lineHeight="30px" fontSize="18px" color="charcoal">
              {title}
            </Text>
            <Text mt="16px" lineHeight="24px">
              {successMsg}
            </Text>
          </Box>
        )}

        <SubmitButton
          mt="16px"
          loading={isLoading || p.isPolling}
          height="46px"
          title={isForm ? 'Send request' : 'Confirm'}
          onPress={
            isForm ? handleSubmit(onSubmit) : handleBtnClick
          }></SubmitButton>
      </Box>
    </SwipableModal>
  )
}

export default FundMpesaModal
