import React from 'react'
import {
  MainNavigationProp,
  WalletRoutes,
  MainNavigationRouteProp,
} from '~types'
import ScreenHeader from '~components/ScreenHeader'
import ScreenContainer from '~components/ScreenContainer'
import { Box, Button, KeyboardAvoidingView } from 'native-base'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { useGetBanks } from '~api/ewa'
import { useMyProfile } from '~api/account'
import { createPickerItems } from '~utils/createPickerItems'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export interface TRecurringAccount {
  acc_name: string
  acc_no: string
  bank_id: null | string
  channel: string
  name: string
}

interface Props {
  navigation: MainNavigationProp<WalletRoutes.CreateRecurringPayment>
  route: MainNavigationRouteProp<WalletRoutes.CreateRecurringPayment>
}

const transferMethods = [
  {
    label: 'Bank Transfer',
    value: 'BANK_TRANSFER',
  },
  {
    label: 'Wallet Transfer',
    value: 'WALLET_TRANSFER',
  },
  {
    label: 'Mpesa',
    value: 'MPESA',
  },
]

const CreateRecurringPayment = ({ navigation }: Props) => {
  const { data } = useMyProfile()
  const country_id = data.data.address.country_id ?? ''
  const params = {
    country_id,
    recordsPerPage: 500,
  }
  const { data: bankData, isLoading: loadingBanks } = useGetBanks(params)
  const banks = createPickerItems(bankData?.data?.data, 'id', 'name') ?? []

  const { control, handleSubmit, setValue, watch } = useForm()

  const channel = watch('channel')

  const onSubmit = (data: TRecurringAccount) => {
    const newObject: TRecurringAccount = {
      ...data,
    }

    navigation.navigate(WalletRoutes.CreateRecurringPayment2, {
      item: newObject,
    })
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Recurring Payments"
        onPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView flex={1} mt={'24px'}>
        <CommonInput
          mb="20px"
          label="Name"
          control={control}
          name="name"
          rules={{
            required: { value: true, message: 'Name is required' },
          }}
        />
        <DropdownInputV2
          label="Transfer method"
          items={transferMethods}
          control={control}
          setValue={value => setValue('channel', value)}
          name="channel"
          rules={{
            required: { value: true, message: 'Channel is required' },
          }}
          zIndex={3000}
        />
        {channel === 'BANK_TRANSFER' ? (
          <>
            <Box my="10px" />
            <DropdownInputV2
              label="Bank"
              control={control}
              name="bank_id"
              items={banks}
              setValue={value => setValue('bank_id', value as string)}
              searchable
              loading={loadingBanks}
              rules={{
                required: { value: true, message: 'Bank is required' },
              }}
            />
          </>
        ) : null}

        <CommonInput
          my="20px"
          label={channel === 'MPESA' ? 'Phone number' : 'Account number'}
          control={control}
          keyboardType="number-pad"
          name="acc_no"
          rules={{
            required: { value: true, message: 'Account is required' },
          }}
        />
        <CommonInput
          label="Account name"
          control={control}
          name="acc_name"
          rules={{
            required: { value: true, message: 'Account name Required' },
          }}
        />
      </KeyboardAwareScrollView>
      <Button onPress={handleSubmit(onSubmit)}>Next</Button>
    </ScreenContainer>
  )
}

export default CreateRecurringPayment
