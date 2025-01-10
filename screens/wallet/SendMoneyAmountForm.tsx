import { Text, Box, HStack, Switch } from 'native-base'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import UserAvatar from '~components/UserAvatar'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  TSendToData,
  WalletRoutes,
} from '~types'
import WalletAmountInput from './components/WalletAmountInput'
import InfoIcon from '~assets/svg/info.svg'
import TextAreaInput from '~components/inputs/TextAreaInput'
import {
  useGetTransferCategories,
  useGetWalletUser,
  useWalletTransfer,
} from '~api/wallet'
import { currencyFormatter } from '~utils/app-utils'
import RecurringTransferModal from './components/modals/RecurringTransferModal'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { isEmpty } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getFirstCharacters } from '~utils/appUtils'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.SendMoneyAmountForm>
  route: MainNavigationRouteProp<WalletRoutes.SendMoneyAmountForm>
}

const SendMoneyAmountForm = ({ route, navigation }: Props) => {
  const sendTo = route.params.sendToId
  const {
    bank_id,
    account_name,
    account_number,
    walletAccNo,
    mobileNumber,
    recipientName,
  } = route.params
  let sendToTitle = 'Send to wallet'
  let paymentMethod = 'WALLET_TRANSFER'
  let displayAcc = '-'
  let displayName = '-'

  const [isRecurring, setIsRecurring] = useState(false)

  const { data } = useGetTransferCategories()
  const { data: walletData } = useGetWalletUser()
  const { mutate } = useWalletTransfer()
  const { handleSubmit, control, watch, setValue } = useForm()

  switch (sendTo) {
    case 'bank':
      sendToTitle = 'Bank Transfer'
      paymentMethod = 'BANK_TRANSFER'
      displayName = account_name ?? '-'
      displayAcc = account_number ?? '-'
      break
    case 'mobile':
      sendToTitle = 'Send to mobile'
      paymentMethod = 'MPESA'
      displayName = recipientName ?? '-'
      displayAcc = mobileNumber ?? '-'
      break
    default:
      sendToTitle = 'Send to wallet'
      paymentMethod = 'WALLET_TRANSFER'
      displayName = recipientName
      displayAcc = walletAccNo ?? '-'

      break
  }

  const newCategories = useMemo(
    () =>
      !isEmpty(data?.data)
        ? data?.data.map(({ name: label, uuid: value, ...rest }) => ({
            label,
            value,
            ...rest,
          }))
        : [],
    [data?.data],
  )

  const amount = watch('amount')
  const message = watch('message')
  const selectedCategory = watch('category')

  const isFormValid = !!amount && !!selectedCategory

  const handleContinue = formData => {
    const sendData: TSendToData = {
      wallet_id: walletData?.data?.wallets[0]?.uuid,
      amount: formData?.amount,
      payment_method: paymentMethod,
      description: formData.message,
      category_id: formData.category,
      ...(sendTo === 'mobile' && { phone_number: mobileNumber }),
      ...(sendTo === 'bank' && {
        bank_id,
        account_number,
        account_name,
      }),
      ...(sendTo === 'wallet' && { recipient_wallet_identifier: walletAccNo }),
    }

    mutate(sendData, {
      onSuccess: successData => {
        navigation.navigate(WalletRoutes.SendMoneyConfirm, {
          sendToId: sendTo,
          sendToData: sendData,
          successData: successData?.data,
          displayAcc,
          displayName,
        })
      },
    })
  }

  const recurringData = {
    user_uuid: walletData?.data?.uuid,
    amount: amount,
    channel: paymentMethod,
    category_uuid: selectedCategory,
    ...(sendTo === 'bank' && {
      bank_id,
      acc_no: account_number,
      acc_name: account_name,
      name: account_name,
    }),
    ...(sendTo === 'wallet' && {
      acc_no: walletAccNo,
      name: recipientName,
      acc_name: recipientName,
    }),
    ...(sendTo === 'mobile' && {
      acc_no: mobileNumber,
      name: mobileNumber,
      acc_name: mobileNumber,
    }),
  }

  const walletBalance = walletData?.data?.wallets?.[0]?.balance

  const avatarFall = getFirstCharacters(recurringData?.acc_name ?? 'W P')

  return (
    <ScreenContainer>
      <ScreenHeader onPress={() => navigation.goBack()} title={sendToTitle} />
      <KeyboardAwareScrollView flex={1}>
        <Box flex={1}>
          <Box alignItems="center" mt="32px" textAlign="center">
            <UserAvatar fallback={avatarFall} width="64px" />
            <Text
              fontFamily="heading"
              fontSize="18px"
              color="charcoal"
              lineHeight="30px">
              {displayName}
            </Text>
            <Text
              fontFamily="heading"
              fontSize="16px"
              lineHeight="24px"
              mb="8px">
              {displayAcc}
            </Text>
            <WalletAmountInput
              control={control}
              label=""
              name="amount"
              placeholder="Ksh 0"
              rules={{
                required: { value: true, message: 'Amount is required' },
              }}
              keyboardType="number-pad"
            />
            <HStack alignItems="center">
              <InfoIcon width={14} height={14} />
              <Text ml="5px" lineHeight="22px">
                Balance: KES {currencyFormatter(walletBalance) ?? '-'}
              </Text>
            </HStack>
          </Box>
          <DropdownInputV2
            label="Category"
            control={control}
            name="category"
            items={newCategories}
            setValue={value => setValue('category', value)}
            // searchable
            zIndex={999}
            rules={{
              required: { value: true, message: 'Category is required' },
            }}
          />

          <Box mt="24px" />
          <TextAreaInput
            control={control}
            name="message"
            placeholder="Add a message"
          />
          <HStack alignItems="center" marginTop="24px">
            <Switch
              disabled={!isFormValid}
              isChecked={isRecurring}
              onToggle={() => setIsRecurring(!isRecurring)}
            />
            <Text lineHeight="24px" fontSize="16px" color="charcoal" ml="8px">
              Make this a recurring transfer
            </Text>
          </HStack>
          <Box height={'400px'} />
        </Box>
      </KeyboardAwareScrollView>
      <SubmitButton title="Continue" onPress={handleSubmit(handleContinue)} />
      <RecurringTransferModal
        isOpen={isRecurring}
        hideModal={() => setIsRecurring(false)}
        recurringData={recurringData}
      />
    </ScreenContainer>
  )
}

export default SendMoneyAmountForm
