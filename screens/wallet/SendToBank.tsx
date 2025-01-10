import React, { useEffect, useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { HStack, Text, Pressable, ScrollView, Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import BeneficiaryModal from './components/modals/BeneficiaryModal'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import { useMyProfile } from '~api/account'
import { useGetBanks } from '~api/ewa'
import { createPickerItems } from '~utils/createPickerItems'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { useRecipientName } from '~api/wallet'
import { isNull, noop } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendToBank>
  route: MainNavigationRouteProp<WalletRoutes.SendToBank>
}

const SendToMobile = ({ navigation }: Props) => {
  const { control, setValue, handleSubmit } = useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [beneficiaryItem, setBeneficiaryItem] = useState<any>()
  const { data } = useMyProfile()
  const country_id = data.data.address.country_id ?? ''
  const { mutate, isLoading } = useRecipientName()

  const params = {
    country_id,
    recordsPerPage: 500,
  }
  const { data: bankData } = useGetBanks(params)

  const banks = createPickerItems(bankData?.data?.data, 'id', 'name') ?? []

  const hideModal = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    if (beneficiaryItem) {
      setValue('acc_no', beneficiaryItem.acc_no)
      setValue('acc_name', beneficiaryItem.acc_name)
      setValue('bank_id', beneficiaryItem.bank?.id)
      setModalVisible(false)
    }
  }, [beneficiaryItem])

  const handleSearchBeneficiary = (text: string) => {
    console.log('  handleSearch: (search: string) => void', text)
  }

  const onSubmit = (formData: any) => {
    const recipientData = {
      payment_method: 'BANK_TRANSFER',
      account_number: formData.acc_no,
    }
    mutate(recipientData, {
      onSuccess: data => {
        const recipientName = !isNull(data?.data?.recipient_name)
          ? data?.data?.recipient_name
          : ''
        navigation.navigate(WalletRoutes.SendMoneyAmountForm, {
          sendToId: 'bank',
          recipientName,
          account_name: formData.acc_name,
          account_number: formData.acc_no,
          bank_id: formData.bank_id,
        })
      },
    })
  }
  return (
    <ScreenContainer>
      <ScreenHeader title="Bank transfer" onPress={() => navigation.goBack()} />
      <ScrollView flex={1}>
        <Box my="12px" />
        <DropdownInputV2
          label="Bank"
          control={control}
          name="bank_id"
          items={banks}
          setValue={value => setValue('bank_id', value as string)}
          searchable
        />
        <HStack justifyContent="space-between" my="4px">
          <Pressable onPress={() => setModalVisible(true)}>
            <Text color="green.50" fontSize="16px" lineHeight="24px">
              Saved Beneficiaries
            </Text>
          </Pressable>
        </HStack>
        <CommonInput
          control={control}
          label="Account number"
          name="acc_no"
          placeholder="Account number"
          keyboardType="number-pad"
          rules={{
            required: { value: true, message: 'Recipient is required' },
          }}
        />
        <CommonInput
          control={control}
          label="Account name"
          name="acc_name"
          placeholder="Account name"
          rules={{
            required: { value: true, message: 'Recipient is required' },
          }}
          my="14px"
        />

        <BeneficiaryModal
          isOpen={modalVisible}
          handleSearchBeneficiary={handleSearchBeneficiary}
          setBeneficiaryItem={setBeneficiaryItem}
          hideModal={hideModal}
          channel="BANK"
        />
      </ScrollView>
      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        title="Next"
      />
    </ScreenContainer>
  )
}

export default SendToMobile
