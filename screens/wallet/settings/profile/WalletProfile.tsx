import React, { useEffect, useRef, useState } from 'react'
import { Box, Text, useToast } from 'native-base'
import { useForm } from 'react-hook-form'

import { useGetWalletUser, useUpdateWalletProfile } from '~api/wallet'

import CommonInput from '~components/inputs/CommonInput'
import ScreenHeader from '~components/ScreenHeader'
import SubmitButton from '~components/buttons/SubmitButton'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import { WalletRoutes } from '~types'
import PhoneField from '~components/inputs/PhoneField'
import PhoneInput from 'react-native-phone-number-input'
import { useFetchProfile } from '~api/home'
import WalletProfileHero from './ProfileHero'
import { useMyProfile } from '~api/account'
import { formatPhoneNumber } from '~utils/appUtils'
import { parsePhoneNumber } from 'libphonenumber-js'

type NavigationProps = {
  navigation: any
}

const WalletProfile = ({ navigation }: NavigationProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm()

  const { data } = useGetWalletUser()
  const phoneRef = useRef<PhoneInput>(null)

  const { data: profileInfo, isLoading: loading } = useFetchProfile()
  const country = profileInfo?.data?.country_code ?? ''
  const countryPhoneinputCode = country.slice(0, 2)

  useEffect(() => {
    if (!loading) {
      const phoneNo = data?.data?.profile?.phone
      const phoneNumber = parsePhoneNumber(phoneNo, countryPhoneinputCode)

      reset({
        name:
          data?.data?.profile?.first_name +
          ' ' +
          data?.data?.profile?.last_name,
        phone: phoneNumber?.nationalNumber,
        email: data?.data?.profile?.email,
      })
    }
  }, [loading])

  const [successModal, setSuccessModal] = useState(false)
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData?.data?.uuid

  const { mutate, isLoading } = useUpdateWalletProfile()

  const onSubmit = data => {
    if (phoneRef.current?.isValidNumber(data.phone) === false) {
      setError('phone', {
        message: 'Phone number is invalid',
      })

      return
    }
    const mobileNumber = `${phoneRef.current?.getCallingCode()}${data.phone}`

    const submitData = {
      ...data,
      user_uuid: uuid,
      phone: mobileNumber,
    }

    mutate(submitData, {
      onSuccess: data => {
        setSuccessModal(true)
      },
    })
  }
  return (
    <Box safeArea px="16px" backgroundColor="white" flex={1}>
      <ScreenHeader
        title="Wallet profile"
        onPress={() => navigation.goBack()}
      />
      <Box mt="10px"></Box>
      <WalletProfileHero />
      <CommonInput
        control={control}
        label="Name"
        name="name"
        placeholder="Name"
        rules={{
          required: { value: true, message: 'Name is required' },
        }}
        my="14px"
      />

      {/* <Box my="8px" /> */}
      <CommonInput
        control={control}
        label="Email Address"
        name="email"
        placeholder="Email"
        rules={{
          required: { value: true, message: 'Email is required' },
        }}
        mt="14px"
      />
      <Box mt="24px" mb={'12px'}>
        <Text fontFamily={'body'} fontSize={'14px'} mb={'5px'} color={'grey'}>
          Mobile number
        </Text>
        <Box>
          <PhoneField
            control={control}
            name="phone"
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
              required: 'Mobile number is required',
            }}
          />
        </Box>
      </Box>
      <SuccessModal
        title={'Profile Updated successfully'}
        message=""
        btnLabel={'Ok'}
        onPressBtn={() => {
          setSuccessModal(false)
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal message="Updating Profile..." isVisible={isLoading} />
      <Box my="8px" flex={1} />
      <SubmitButton
        loading={isLoading}
        title="Save"
        onPress={handleSubmit(onSubmit)}
      />
    </Box>
  )
}

export default WalletProfile
