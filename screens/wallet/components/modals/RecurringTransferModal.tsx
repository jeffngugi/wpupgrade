import React, { useState } from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import {
  Box,
  Button,
  HStack,
  Pressable,
  Switch,
  Text,
  useToast,
} from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { ESendToID, WalletRoutes } from '~types'
import { useCreateRecurringTransfer } from '~api/wallet'
import { useNavigation } from '@react-navigation/native'
import { transferFrequency } from '~screens/wallet/data/useWalletData'
import { addDays } from 'date-fns'

type TrecurringData = {
  user_uuid: string
  account_number?: string | undefined
  name?: string | undefined
  acc_name?: string | undefined
  bank_id?: string | undefined
  account_name?: string | undefined
  amount: any
  channel: ESendToID
  category_uuid: any
}

type Props = {
  isOpen: boolean
  hideModal: () => void
  recurringData: TrecurringData
}

const RecurringTransferModal = (p: Props) => {
  const navigation = useNavigation()
  const { control, handleSubmit, setValue, watch } = useForm()
  const [hasEndDate, setHasEndDate] = useState(false)
  const { mutate, isLoading } = useCreateRecurringTransfer()
  const toast = useToast()

  const currentDate = new Date()

  const tomorrow = addDays(currentDate, 1)

  const frequency = watch('frequency')

  const onSubmit = data => {
    const submitData = {
      ...p.recurringData,
      ...data,
      ...(hasEndDate && { end_date: data.end_date }),
    }
    mutate(submitData, {
      onSuccess: data => {
        // navigation.navigate(WalletRoutes.RecurringPayment)
        p.hideModal()
        toast.show({
          title: 'Added successfully, continue',
          placement: 'top',
        })
      },
    })
  }
  return (
    <SwipableModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box px="16px" flex={1} top="-20">
        <HStack alignItems="center" mb="24px">
          <Pressable onPress={p.hideModal}>
            <XIcon color="#253545" />
          </Pressable>
          <Text
            color="#253545"
            fontSize="20px"
            lineHeight="30px"
            ml="68px"
            fontFamily="heading">
            Recurring transfer
          </Text>
        </HStack>
        <Box mb="5px" />

        <DropdownInputV2
          items={transferFrequency}
          control={control}
          setValue={value => setValue('frequency', value)}
          name="frequency"
          label="Frequency"
        />
        <Box my="8px" />
        <DateInput
          control={control}
          name="start_date"
          label="Start Date"
          minimumDate={tomorrow}
        />
        <HStack alignItems="center" marginTop="24px">
          <Switch
            isChecked={hasEndDate}
            onToggle={() => setHasEndDate(!hasEndDate)}
          />
          <Text lineHeight="24px" fontSize="16px" color="charcoal" ml="8px">
            Include End Date
          </Text>
        </HStack>
        {hasEndDate ? (
          <Box my="8px">
            <DateInput
              control={control}
              name="end_date"
              label="End Date"
              minimumDate={addDays(tomorrow, 1)}
            />
          </Box>
        ) : null}
        <Button
          isLoading={isLoading}
          mt="150px"
          mb="20px"
          onPress={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default RecurringTransferModal
