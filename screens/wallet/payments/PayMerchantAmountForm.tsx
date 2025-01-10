import { Box, HStack, Text } from 'native-base'
import React, { useMemo } from 'react'
import SubmitButton from '~components/buttons/SubmitButton'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  TLipaSubmitData,
  TWalletTransferResponse,
  WalletRoutes,
} from '~types'
import UserAvatar from '~components/UserAvatar'
import { currencyFormatter } from '~utils/app-utils'
import { useForm } from 'react-hook-form'
import InfoIcon from '~assets/svg/info.svg'
import CurrencyAmountInput from '../components/CurrencyAmountInput'
import { useWalletStatus } from '../hooks/useWalletStatus'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { isEmpty, isNull } from 'lodash'
import { useGetTransferCategories, useWalletTransfer } from '~api/wallet'
import ActionSheetPicker from '~components/inputs/ActionSheetPicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.MerchantAmountForm>
  route: MainNavigationRouteProp<WalletRoutes.MerchantAmountForm>
}

const PayMerchantAmountForm = ({ navigation, route }: Props) => {
  const { merchantType, lipaAccount, recipientName } = route.params
  const title = merchantType === 'TILL' ? 'Pay to till' : 'Pay to paybill'
  const { control, handleSubmit, setValue } = useForm()
  const { wallet_account } = useWalletStatus()
  const { data } = useGetTransferCategories()
  const { mutate, isLoading } = useWalletTransfer()
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
  const onSubmit = (data: any) => {
    const submitData: TLipaSubmitData = {
      amount: data?.amount,
      category_id: data?.category,
      payment_method: merchantType,
      wallet_id: wallet_account?.uuid,
      merchant_number: lipaAccount.merchant_number,
      ...(merchantType === 'PAYBILL' && {
        account_number: lipaAccount.account_number,
      }),
    }

    mutate(submitData, {
      onSuccess: data => {
        const successData: TWalletTransferResponse = data?.data
        navigation.navigate(WalletRoutes.MerchantReview, {
          merchantType,
          submitData,
          successData,
          recipientName,
        })
      },
    })
  }

  const walletBalance = wallet_account?.balance ?? '-'
  const showRecipient = !isNull(recipientName) && merchantType === 'PAYBILL'
  return (
    <ScreenContainer>
      <ScreenHeader onPress={() => navigation.goBack()} title={title} />
      <KeyboardAwareScrollView flex={1}>
        <Box flex={1}>
          <Box
            alignItems="center"
            mt="32px"
            textAlign="center"
            marginBottom="20px">
            <UserAvatar
              fallback={'WP'}
              width="64px"
              bgColor="#DBE6F5"
              txtColor="#3E8BEF"
            />
            <Text
              fontFamily="heading"
              fontSize="18px"
              marginTop="10px"
              color="charcoal"
              lineHeight="30px">
              {lipaAccount.merchant_number}
            </Text>
            {showRecipient ? (
              <Text
                fontFamily="heading"
                fontSize="16px"
                lineHeight="24px"
                mb="8px">
                {isNull(recipientName)
                  ? recipientName
                  : lipaAccount.account_number}
              </Text>
            ) : null}
            <CurrencyAmountInput
              control={control}
              label="Amount"
              name="amount"
              placeholder="KES"
              rules={{
                required: 'Amount is required',
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: 'Please enter a valid number',
                },
                validate: (value: string) => {
                  const num = parseFloat(value)
                  if (isNaN(num)) return 'Please enter a valid number'
                  if (num < 0) return 'Amount must be positive'
                  if (num > parseFloat(walletBalance))
                    return 'Insufficient balance'
                  return true
                },
              }}
              keyboardType="number-pad"
            />
            <HStack alignItems="center">
              <InfoIcon width={14} height={14} />
              <Text ml="5px" lineHeight="22px">
                Balance: {wallet_account?.currency}
                {currencyFormatter(walletBalance) ?? '-'}
              </Text>
            </HStack>
          </Box>

          <ActionSheetPicker
            label="Category"
            control={control}
            name="category"
            options={newCategories}
            setValue={value => setValue('category', value)}
            rules={{
              required: { value: true, message: 'Category is required' },
            }}
          />
        </Box>
      </KeyboardAwareScrollView>
      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title="Continue"
        loading={isLoading}
      />
    </ScreenContainer>
  )
}

export default PayMerchantAmountForm
