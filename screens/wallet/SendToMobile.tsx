import React, { useEffect, useRef, useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { HStack, Text, Pressable, Button } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { useForm } from 'react-hook-form'
import WalletContacts from './components/WalletContacts'
import { IPhoneContact } from '~utils/phoneContacts'
import BeneficiaryModal from './components/modals/BeneficiaryModal'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  TLinkedAccount,
  WalletRoutes,
} from '~types'
import PhoneField from '~components/inputs/PhoneField'
import PhoneInput from 'react-native-phone-number-input'
import { useRecipientName } from '~api/wallet'
import { isNull } from 'lodash'
import CommonInput from '~components/inputs/CommonInput'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendToMobile>
  route: MainNavigationRouteProp<WalletRoutes.SendToMobile>
}

const SendToMobile = ({ navigation }: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm()
  const [contactsVisible, setContactsVisible] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const phoneRef = useRef<PhoneInput>(null)
  const { mutate, isLoading } = useRecipientName()
  const [beneficiaryItem, setBeneficiaryItem] = useState<TLinkedAccount>()

  const handlePressContact = (item: IPhoneContact) => {
    const { phoneNumber } = item
    setValue('account_number', phoneNumber.replace(/\D/g, ''))
    setContactsVisible(false)
  }

  useEffect(() => {
    if (beneficiaryItem) {
      setValue('account_number', beneficiaryItem.acc_no)
      setModalVisible(false)
    }
  }, [beneficiaryItem])

  const hideModal = () => {
    setModalVisible(false)
  }

  const handleSearchBeneficiary = (text: string) => {
    console.log('  handleSearch: (search: string) => void', text)
  }

  const onSubmit = (formData: any) => {
    // const mobileNumber = `+${phoneRef.current?.getCallingCode()}${
    //   formData.phoneNumber
    // }`
    const mobileNumber = formData.account_number
    const recipientData = {
      payment_method: 'MPESA',
      account_number: formData.account_number,
    }
    mutate(recipientData, {
      onSuccess: data => {
        const recipientName = !isNull(data?.data?.recipient_name)
          ? data?.data?.recipient_name
          : ''
        navigation.navigate(WalletRoutes.SendMoneyAmountForm, {
          sendToId: 'mobile',
          recipientName,
          mobileNumber,
        })
      },
    })
    // navigation.navigate(WalletRoutes.SendMoneyAmountForm, {
    //   sendToId: 'mobile',
    //   recipientName:''
    // })
  }
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Send to mobile"
        onPress={() => navigation.goBack()}
      />

      <CommonInput
        placeholder="254..."
        control={control}
        label={'Recipient'}
        keyboardType="number-pad"
        name={'account_number'}
      />
      {/* <PhoneField
        control={control}
        name="phoneNumber"
        error={isDirty ? errors.phoneNumber : undefined}
        ref={phoneRef}
        textInputStyle={{ height: 40, paddingLeft: 0 }}
        defaultCode="KE"
        placeholder="Phone #"
        containerStyle={{ width: '100%', height: 46 }}
        disabled={false}
        rules={{
          required: { value: true, message: 'Provide phone number' },
        }}
      /> */}

      {/* <GrantAccess /> */}
      <HStack justifyContent="space-between" mt="24px" mb="16px">
        <Text fontSize="16px" lineHeight="24px">
          All contacts
        </Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text color="green.50" fontSize="16px" lineHeight="24px">
            Saved Beneficiaries
          </Text>
        </Pressable>
      </HStack>
      <Text>Please select a contact</Text>
      <WalletContacts onPress={handlePressContact} />
      <BeneficiaryModal
        isOpen={modalVisible}
        handleSearchBeneficiary={handleSearchBeneficiary}
        setBeneficiaryItem={setBeneficiaryItem}
        hideModal={hideModal}
        channel="MPESA"
      />
      <Button isLoading={isLoading} onPress={handleSubmit(onSubmit)}>
        Next
      </Button>
    </ScreenContainer>
  )
}

export default SendToMobile
