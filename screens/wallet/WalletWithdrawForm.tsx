import React, { useMemo } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { Box, HStack, InfoIcon, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import UserAvatar from '~components/UserAvatar'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import TextAreaInput from '~components/inputs/TextAreaInput'
import { currencyFormatter } from '~utils/app-utils'
import WalletAmountInput from './components/WalletAmountInput'
import { useForm } from 'react-hook-form'
import {
  MainNavigationProp,
  WalletRoutes,
  MainNavigationRouteProp,
} from '~types'
import {
  useGetTransferCategories,
  useGetWalletUser,
  useMakeWithdrawal,
} from '~api/wallet'
import { isEmpty } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'
import { TWithdrawResponse } from './types'
import { getFirstCharacters } from '~utils/appUtils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.WithdrawMoneyAmountForm>
  route: MainNavigationRouteProp<WalletRoutes.WithdrawMoneyAmountForm>
}

const WalletWithdrawForm = ({ navigation, route }: Props) => {
  const { control, handleSubmit, setValue } = useForm()
  const { data } = useGetTransferCategories()
  const { data: walletData } = useGetWalletUser()
  const { mutate, isLoading } = useMakeWithdrawal()
  const walletBalance = walletData?.data?.wallets[0]?.balance

  const item = route.params.item
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

  const onSubmit = (formData: any) => {
    const submitData = {
      ...formData,
      linked_account_id: item.uuid,
    }
    mutate(submitData, {
      onSuccess: data => {
        const withdrawData: TWithdrawResponse = data?.data
        navigation.navigate(WalletRoutes.WithdrawConfirm, { withdrawData })
      },
    })
  }

  const accNo = item.acc_no ?? ''
  const provider = item.bank?.name ?? 'Mobile'

  const desc = `${provider} | ${accNo}`

  const initials = getFirstCharacters(item.acc_name)

  return (
    <ScreenContainer>
      {/* <Box style={{ flex: 1 }}> */}
      <ScreenHeader onPress={() => navigation.goBack()} title="Withdraw" />
      <KeyboardAwareScrollView flex={1}>
        <Box alignItems="center" mt="32px" textAlign="center" mb="40px">
          <UserAvatar fallback={initials ?? 'WP'} width="64px" />
          <Text
            fontFamily="heading"
            fontSize="18px"
            color="charcoal"
            lineHeight="30px">
            {item.acc_name ?? '-'}
          </Text>
          <Text fontFamily="heading" fontSize="16px" lineHeight="24px" mb="8px">
            {desc}
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
          name="category_id"
          items={newCategories}
          setValue={value => setValue('category_id', value)}
          // searchable
          zIndex={999}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
        />
        <Box mt="24px" />
        <TextAreaInput
          control={control}
          name="description"
          placeholder="Add a message"
        />
        {/* </Box> */}
      </KeyboardAwareScrollView>
      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        title="Continue"></SubmitButton>
    </ScreenContainer>
  )
}

export default WalletWithdrawForm
