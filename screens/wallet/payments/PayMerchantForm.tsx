import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { HStack, Text, Pressable, Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  TLipaAccount,
  WalletRoutes,
} from '~types'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import SubmitButton from '~components/buttons/SubmitButton'
import { Keyboard } from 'react-native'
import { useRecipientName } from '~api/wallet'
import { isNull } from 'lodash'
import MerchantModal, { TMerchant } from '../components/modals/MerchantModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.Merchant>
  route: MainNavigationRouteProp<WalletRoutes.MerchantForm>
}

const PayMerchantForm = ({ navigation, route }: Props) => {
  const { merchantType } = route.params
  const [open, setOpen] = useState(false)
  const hideModal = () => setOpen(false)
  const { control, setValue, handleSubmit } = useForm<TLipaAccount>()
  const { mutate, isLoading } = useRecipientName()
  const label = merchantType === 'TILL' ? 'Mpesa Till' : 'Mpesa Paybill'
  const title = merchantType === 'TILL' ? 'Pay to till' : 'Pay to paybill'
  const accountError =
    merchantType === 'TILL' ? 'Till number is required' : 'Paybill is required'

  const handlePressCard = (item: TMerchant) => {
    setValue('merchant_number', item.merchant_number)
    if (item.channel === 'PAYBILL') {
      setValue('account_number', item.acc_no)
    }
    hideModal()
  }
  const onSubmit = (data: TLipaAccount) => {
    const lipaAccountData: TLipaAccount = data
    const recipientData = {
      payment_method: merchantType,
      account_number: lipaAccountData.merchant_number,
    }
    mutate(recipientData, {
      onSuccess: data => {
        const recipientName = !isNull(data?.data?.recipient_name)
          ? data?.data?.recipient_name
          : ''
        navigation.navigate(WalletRoutes.MerchantAmountForm, {
          merchantType,
          lipaAccount: lipaAccountData,
          recipientName,
        })
      },
    })
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={title} onPress={() => navigation.goBack()} />
      <KeyboardAwareScrollView flex={1}>
        <Box flex={1} marginBottom="50px">
          <Box my="5px" />

          <CommonInput
            control={control}
            label={label}
            name="merchant_number"
            rules={{
              required: { value: true, message: accountError },
            }}
            keyboardType="number-pad"
          />
          <HStack justifyContent="flex-end">
            <Pressable
              onPress={async () => {
                await Keyboard.dismiss()
                setOpen(true)
              }}
              marginY="10px">
              <Text color="green.50" fontSize="16px" lineHeight="19px">
                Saved Merchants
              </Text>
            </Pressable>
          </HStack>
          {merchantType === 'PAYBILL' ? (
            <CommonInput
              control={control}
              label="Account number"
              name="account_number"
              rules={{
                required: {
                  value: true,
                  message: 'Account number is required',
                },
              }}
            />
          ) : null}
        </Box>
      </KeyboardAwareScrollView>
      <SubmitButton
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        title="Next"
      />
      <MerchantModal
        hideModal={hideModal}
        open={open}
        handlePressCard={handlePressCard}
        channel={merchantType}
      />
    </ScreenContainer>
  )
}

export default PayMerchantForm
