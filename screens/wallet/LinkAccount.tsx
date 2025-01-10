import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import { Box, Button, HStack, Pressable, ScrollView, Text } from 'native-base'
import ScreenContainer from '~components/ScreenContainer'
import { useForm } from 'react-hook-form'
import { useCreateBeneficiary, useGetBanks } from '~api/ewa'
import { useMyProfile } from '~api/account'
import { createPickerItems } from '~utils/createPickerItems'
import CommonInput from '~components/inputs/CommonInput'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import {
  useCreateWalletBeneficiary,
  useGetLinkedAccounts,
  useGetWalletUser,
} from '~api/wallet'
import BankIcon from '~assets/svg/wallet-bank.svg'
import MobileIcon from '~assets/svg/mobile.svg'
import { SvgProps } from 'react-native-svg'
import { isNil } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'

const LinkAccount = ({ navigation }) => {
  const { control, handleSubmit, setValue } = useForm()
  const { data } = useMyProfile()
  const [linkTo, setLinkTo] = useState<'bank' | 'mobile' | null>(null)
  const country_id = data.data.address.country_id ?? ''
  const { data: walletData } = useGetWalletUser()
  const { mutate, isLoading } = useCreateWalletBeneficiary()
  const { data: LinkedData } = useGetLinkedAccounts()

  const uuid = walletData.data.uuid
  const params = {
    country_id,
    recordsPerPage: 500,
  }
  const { data: bankData } = useGetBanks(params)
  const hasBank = LinkedData?.data.find(
    data => data?.channel === 'BANK_TRANSFER',
  )
  const hasMobile = LinkedData?.data.find(
    data => data?.channel !== 'BANK_TRANSFER',
  )

  const pickerItems =
    createPickerItems(bankData?.data?.data, 'id', 'name') ?? []

  const onSubmit = data => {
    const payload = {
      ...data,
      channel: linkTo === 'bank' ? 'BANK_TRANSFER' : 'MPESA',
      is_owner_acc: 1,
      user_uuid: uuid,
      type: 'TRANSFER',
    }
    console.log(payload)
    mutate(payload, {
      onSuccess: data => {
        navigation.goBack()
      },
    })
  }

  const handlePress = (toLink: 'bank' | 'mobile') => {
    setLinkTo(toLink)
  }

  const LinkToCard = ({
    onPress,
    label,
    Icon,
    active,
  }: {
    onPress: () => void
    label: string
    Icon: React.FC<SvgProps>
    active: boolean
  }) => {
    return (
      <Pressable
        paddingY="20px"
        borderWidth="1px"
        borderRadius="4px"
        borderColor={active ? 'green.50' : '#E3E9EC'}
        alignSelf="center"
        width="47%"
        alignItems="center"
        backgroundColor={active ? '#F1FDEB' : 'white'}
        onPress={onPress}
        textAlign="center">
        <Icon color={active ? '#62A446' : '#000000'} width={24} height={24} />
        <Text marginTop="20px">{label}</Text>
      </Pressable>
    )
  }
  return (
    <ScreenContainer>
      <ScreenHeader title="Link Account" onPress={() => navigation.goBack()} />
      <ScrollView flex={1} marginTop="30px">
        <HStack mb="32px" justifyContent="space-between">
          {hasBank ? null : (
            <LinkToCard
              label="Link Bank"
              active={linkTo === 'bank'}
              onPress={() => handlePress('bank')}
              Icon={BankIcon}
            />
          )}
          {hasMobile ? null : (
            <LinkToCard
              label="Link Mobile Wallet"
              active={linkTo === 'mobile'}
              onPress={() => handlePress('mobile')}
              Icon={MobileIcon}
            />
          )}
        </HStack>

        {linkTo ? (
          <>
            <CommonInput
              label="Alias"
              name="name"
              control={control}
              rules={{
                required: { value: true, message: 'Alias is required' },
              }}
              marginTop="20px"
            />
            {linkTo === 'bank' ? (
              <>
                <Box marginTop="20px" />

                <DropdownInputV2
                  label="Bank"
                  control={control}
                  name="bank_id"
                  items={pickerItems}
                  setValue={value => setValue('bank_id', value as string)}
                  searchable
                  rules={{
                    required: { value: true, message: 'Bank is required' },
                  }}
                />
              </>
            ) : null}

            <CommonInput
              label={linkTo === 'bank' ? 'Account number' : 'Phone number'}
              name="acc_no"
              control={control}
              keyboardType="phone-pad"
              rules={{
                required: { value: true, message: 'Required' },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Invalid account',
                },
              }}
              marginTop="20px"
            />
            <CommonInput
              label="Account name"
              name="acc_name"
              control={control}
              rules={{
                required: { value: true, message: 'Account name is required' },
              }}
              marginTop="20px"
            />
          </>
        ) : null}
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        disabled={isNil(linkTo)}
        title="Link account"
      />


    </ScreenContainer>
  )
}

export default LinkAccount
