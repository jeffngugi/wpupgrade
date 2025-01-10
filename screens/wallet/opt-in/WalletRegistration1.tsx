import React, { useEffect, useRef } from 'react'
import { Box, Button, Progress, ScrollView, Text, Toast } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { WalletRoutes } from '~types'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import { useOptInWallet } from '~api/wallet'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { useFetchProfile } from '~api/home'
import { useMyProfile } from '~api/account'
import { isString, words } from 'lodash'
import PhoneInput from 'react-native-phone-number-input'
import PhoneField from '~components/inputs/PhoneField'
import { formatPhoneNumber } from '~utils/appUtils'
import parsePhoneNumber from 'libphonenumber-js'
import SubmitButton from '~components/buttons/SubmitButton'

const WalletRegistration1 = ({ navigation }) => {
  const { user } = useSelector((state: State) => state.user)
  const { data: profileInfo, isLoading: loading } = useFetchProfile()
  const country = profileInfo?.data?.country_code ?? ''
  const countryPhoneinputCode = country.slice(0, 2)

  const phoneRef = useRef<PhoneInput>(null)

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm()
  const { mutate, isLoading } = useOptInWallet()
  const { data: profileData } = useFetchProfile()
  const { data: myProfileData } = useMyProfile()
  const { email, full_names, phone_no, phone_number, mobile_no } =
    profileData?.data
  const { id_no, pin_no } = myProfileData?.data

  const fullNames = words(full_names)

  useEffect(() => {
    const number = mobile_no ?? phone_number ?? phone_no
    const phone = isString(number) ? number : ''
    const phoneNumber = parsePhoneNumber(phone, countryPhoneinputCode)

    setValue('first_name', fullNames[0])
    setValue('last_name', fullNames[1])
    setValue('email', email)
    setValue('doc_no', id_no)
    setValue('kra_pin', pin_no)
    setValue('phone', phoneNumber?.nationalNumber)
  }, [profileData, myProfileData])

  const onSubmit = (data: any) => {
    if (phoneRef.current?.isValidNumber(data.phone) === false) {
      setError('phone', {
        message: 'Phone number is invalid',
      })

      return
    }
    const mobileNumber = `${phoneRef.current?.getCallingCode()}${data.phone}`

    const submitData = {
      ...data,
      phone: mobileNumber,
      employee_id: user.employee_id,
      doc_type: 'NATIONAL_ID',
    }

    mutate(submitData, {
      onSuccess: data => {
        navigation.navigate(WalletRoutes.SecurityQuestion)
      },
    })
  }

  return (
    <Box flex={1} safeArea backgroundColor="white">
      <Box paddingX="18px" mb="16px">
        <ScreenHeader
          title="Personal Details"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Progress
        value={35}
        _filledTrack={{
          bg: 'green.40',
          height: '8px',
        }}
      />
      <Box paddingX="16px" flex={1}>
        <ScrollView flex={1}>
          <Text fontSize="16px" my="10px" mb="16px" color="charcoal">
            Fill in your personal details to get started
          </Text>
          <CommonInput
            label="First Name"
            name={'first_name'}
            control={control}
            placeholder="First name"
            rules={{
              required: { value: true, message: 'First name is required' },
            }}
          />
          <CommonInput
            my="10px"
            label="Last Name"
            name={'last_name'}
            control={control}
            placeholder="Last name"
          />
          <CommonInput
            my="10px"
            label="Email"
            name={'email'}
            control={control}
            placeholder="Email"
            rules={{
              required: { value: true, message: 'Email is required' },
            }}
          />

          <Box mt="24px" mb={'12px'}>
            <Text
              fontFamily={'body'}
              fontSize={'14px'}
              mb={'5px'}
              color={'grey'}>
              Phone number
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
                  required: 'Phone number is required',
                }}
              />
            </Box>
          </Box>
          <CommonInput
            my="10px"
            label="ID/Passport Number"
            name={'doc_no'}
            control={control}
            placeholder="ID/Passport Number"
            rules={{
              required: { value: true, message: 'ID/Passport is required' },
            }}
          />
          <CommonInput
            my="10px"
            label="KRA PIN"
            name={'kra_pin'}
            control={control}
            placeholder="KRA PIN"
            rules={{
              required: { value: true, message: 'KRA PIN is required' },
            }}
          />
        </ScrollView>
        <SubmitButton
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
          title="Next"
        />
      </Box>
    </Box>
  )
}

export default WalletRegistration1
