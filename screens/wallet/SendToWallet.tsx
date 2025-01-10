import React, { useEffect, useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { HStack, Text, Pressable, Button, Toast } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import WalletContacts from './components/WalletContacts'
import { IPhoneContact } from '~utils/phoneContacts'
import BeneficiaryModal from './components/modals/BeneficiaryModal'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  TLinkedAccount,
  WalletRoutes,
} from '~types'
import { useRecipientName } from '~api/wallet'
import { isNull } from 'lodash'
import ErrorAlert from '~components/ErrorAlert'
import SubmitButton from '~components/buttons/SubmitButton'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendToWallet1>
  route: MainNavigationRouteProp<WalletRoutes.SendToWallet1>
}

const SendToWallet = ({ navigation }: Props) => {
  const { control, setValue, handleSubmit } = useForm()
  const [contactsVisible, setContactsVisible] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [beneficiaryItem, setBeneficiaryItem] = useState<TLinkedAccount>()
  const { mutate, isLoading } = useRecipientName()

  useEffect(() => {
    if (beneficiaryItem) {
      setValue('recipient', beneficiaryItem.acc_no)
      setModalVisible(false)
    }
  }, [beneficiaryItem])

  const handlePressContact = (item: IPhoneContact) => {
    const { phoneNumber } = item
    setValue('recipient', phoneNumber.replace(/\D/g, ''))
    setContactsVisible(false)
  }
  const hideModal = () => {
    setModalVisible(false)
  }

  const handleSearchBeneficiary = (text: string) => {
    console.log('  handleSearch: (search: string) => void', text)
  }

  const onSubmit = (formData: any) => {
    const recipientData = {
      payment_method: 'WALLET_TRANSFER',
      account_number: formData.recipient,
    }
    mutate(recipientData, {
      onSuccess: data => {
        if (isNull(data?.data?.recipient_name)) {
          Toast.show({
            render: () => (
              <ErrorAlert title="Error" description="Wallet not found" />
            ),
            placement: 'top',
            top: 100,
            duration: 3000,
          })
          return
        }

        const recipientName = !isNull(data?.data?.recipient_name)
          ? data?.data?.recipient_name
          : ''
        navigation.navigate(WalletRoutes.SendMoneyAmountForm, {
          sendToId: 'wallet',
          recipientName,
          walletAccNo: formData.recipient,
        })
      },
    })
  }
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Send to wallet"
        onPress={() => navigation.goBack()}
      />
      <CommonInput
        control={control}
        label="Recipient"
        name="recipient"
        placeholder="Name, email, Phone Number"
        rules={{
          required: { value: true, message: 'Recipient is required' },
        }}
        keyboardType="number-pad"
      />
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
        hideModal={hideModal}
        setBeneficiaryItem={setBeneficiaryItem}
        channel="WALLET"
      />
      <SubmitButton
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        title="Next"
      />
    </ScreenContainer>
  )
}

export default SendToWallet
