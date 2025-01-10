import React, { useEffect, useState } from 'react'
import SwipableModal from './SwipableModal'
import { Box, HStack, Text, Button } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import XIcon from '~assets/svg/wallet-x.svg'
import { Pressable } from 'react-native'
import { TLinkedAccount, WalletRoutes } from '~types'
import { useMyProfile } from '~api/account'
import { useGetBanks } from '~api/ewa'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { createPickerItems } from '~utils/createPickerItems'
import { useEditWalletBeneficiary } from '~api/wallet'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import { useNavigation } from '@react-navigation/native'

type Props = {
  isOpen: boolean
  hideModal: () => void
  item: TLinkedAccount | undefined
  isAccOwner?: boolean
}

const EditLinkedAccountModal = (p: Props) => {
  const { control, setValue, handleSubmit } = useForm()
  const [isForm, setIsForm] = useState(true)
  const { mutate, isLoading: updating } = useEditWalletBeneficiary()
  const { data } = useMyProfile()
  const country_id = data.data.address.country_id ?? ''
  const navigation = useNavigation()
  const params = {
    country_id,
    recordsPerPage: 500,
  }
  const { data: bankData } = useGetBanks(params)

  const pickerItems =
    createPickerItems(bankData?.data?.data, 'id', 'name') ?? []

  const closeModal = () => {
    p.hideModal()
    setIsForm(true)
  }

  const handleBtnClick = () => {
    isForm ? setIsForm(false) : closeModal()
  }
  useEffect(() => {
    if (p.item) {
      setValue('acc_no', p.item.acc_no)
      setValue('acc_name', p.item.name)
    }
  }, [])

  useEffect(() => {
    if (p.item) {
      if (p.item.channel === 'BANK_TRANSFER') {
        setValue('acc_no', p.item.acc_no)
        setValue('acc_name', p.item.name)
        setValue('bank_id', p.item.bank.id)
      }
    }
  }, [pickerItems, p.item])

  const onSubmit = (data: any) => {
    const isAccOwner = p.isAccOwner
    const item = p.item
    const submitData = {
      name: data.acc_name,
      acc_name: data.acc_name,
      acc_no: data.acc_no,
      type: item?.type,
      uuid: item?.uuid,
      channel: item?.channel,
      ...(item?.channel === 'BANK_TRANSFER' && { bank_id: data.bank_id }),
      ...(isAccOwner && { is_owner_acc: 1 }),
    }

    mutate(submitData, {
      onSuccess: () => {
        queryClient.invalidateQueries(walletQKeys.beneficiaries)
        queryClient.invalidateQueries(walletQKeys.linkedAcc)
      },
      onSettled: () => {
        closeModal()
        navigation.navigate(WalletRoutes.Beneficiaries)
      },
    })
  }

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      {/* <ModalHandle style={{ top: -20, position: 'relative' }} /> */}
      <Box paddingX="16px" paddingBottom="30px" top="-20px">
        <HStack mb="40px" alignItems="center" justifyContent="space-between">
          <Text color="charcoal" fontSize="20px" lineHeight="30px">
            Edit Account
          </Text>
          <Pressable onPress={closeModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>

        {p?.item?.channel === 'BANK_TRANSFER' ? (
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
        ) : null}

        <CommonInput
          control={control}
          label="Account number"
          name="acc_no"
          mt="24px"
        />
        <CommonInput
          control={control}
          label="Account name"
          name="acc_name"
          mt="24px"
        />

        <Button
          mt="36px"
          height="46px"
          onPress={handleSubmit(onSubmit)}
          isLoading={updating}>
          Save
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default EditLinkedAccountModal
