import React, { useMemo, useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Box, HStack, InfoIcon, Button, Text, Heading } from 'native-base'
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
  useCreateRecurringTransfer,
  useGetTransferCategories,
  useGetWalletUser,
} from '~api/wallet'
import { isEmpty } from 'lodash'
import WalletCommonModal from './components/modals/WalletCommonModal'
import OptInImg from '~assets/svg/optin-success.svg'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.CreateRecurringPayment3>
  route: MainNavigationRouteProp<WalletRoutes.CreateRecurringPayment3>
}

const CreateRecurringPayment3 = ({ navigation, route }: Props) => {
  const { control, handleSubmit, setValue } = useForm()
  const { data } = useGetTransferCategories()
  const [successModal, setSuccessModal] = useState(false)
  const prevData = route.params.item
  const { data: walletData } = useGetWalletUser()
  const { mutate, isLoading } = useCreateRecurringTransfer()
  const walletBalance = walletData?.data?.wallets[0]?.balance

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
      user_uuid: walletData?.data?.uuid,
      ...prevData,
      ...formData,
    }
    mutate(submitData, {
      onSuccess: data => {
        setSuccessModal(true)
      },
    })
  }

  const handleDone = () => {
    navigation.navigate(WalletRoutes.RecurringPayment)
  }

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <ScreenHeader
          onPress={() => navigation.goBack()}
          title="Recurring Payments"
        />
        <Box alignItems="center" mt="32px" textAlign="center" mb="40px">
          <UserAvatar fallback="AK" width="64px" />
          <Text
            fontFamily="heading"
            fontSize="18px"
            color="charcoal"
            lineHeight="30px">
            {prevData.acc_name ?? prevData.name}
          </Text>
          <Text fontFamily="heading" fontSize="16px" lineHeight="24px" mb="8px">
            {prevData.acc_no}
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
        <TextAreaInput
          control={control}
          name="message"
          placeholder="Add a message"
        />
        <Box mt="24px" />

        <DropdownInputV2
          label="Category"
          control={control}
          name="category_uuid"
          items={newCategories}
          setValue={value => setValue('category_uuid', value)}
          // searchable
          zIndex={999}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
        />
      </KeyboardAwareScrollView>
      <Button onPress={handleSubmit(onSubmit)}>Continue</Button>
      <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <OptInImg />
          </Box>
          <Heading color="white" fontSize="24px" textAlign="center">
            Recurring payment created{'\n'} successfully
          </Heading>
        </Box>

        <Button
          backgroundColor="#387E1B"
          onPress={handleDone}
          isLoading={isLoading}>
          <Text color="white" fontSize="18px">
            Done
          </Text>
        </Button>
      </WalletCommonModal>
    </ScreenContainer>
  )
}

export default CreateRecurringPayment3
