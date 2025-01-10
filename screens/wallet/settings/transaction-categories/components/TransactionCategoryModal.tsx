import React, { useEffect, useState } from 'react'
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
import { ESendToID } from '~types'
import {
  useCreateRecurringTransfer,
  useGetWalletUser,
  useUpdateTransactionCategory,
} from '~api/wallet'
import TextAreaInput from '~components/inputs/TextAreaInput'
import CommonInput from '~components/inputs/CommonInput'
import { colorCodes } from '../AddTransactionCategory'

type TransferCategory = {
  user_uuid?: string
  uuid?: string
  name?: string | undefined
  color?: string | undefined
  description?: string | undefined
}

type Props = {
  isOpen: boolean
  hideModal: () => void
  categoryData: TransferCategory
}

const TransactionCategoryModal = (p: Props) => {
  const { control, handleSubmit, setValue } = useForm()

  const { mutate, isLoading } = useUpdateTransactionCategory()
  const { data } = useGetWalletUser()
  const uuid = data?.data?.uuid
  const categoryUuid = p.categoryData?.uuid

  const toast = useToast()

  useEffect(() => {
    setValue('name', p.categoryData?.name)
    setValue('color', p.categoryData?.color)
    setValue('description', p.categoryData?.description)
  }, [p.categoryData])

  const onSubmit = data => {
    const submitData = {
      user_uuid: uuid,
      ...data,
      uuid: categoryUuid,
    }

    mutate(submitData, {
      onSuccess: data => {
        p.hideModal()
        toast.show({
          title: 'Updated successfully, continue',
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
            Edit Category
          </Text>
        </HStack>
        <CommonInput
          control={control}
          label="name"
          name="name"
          placeholder="Name"
          rules={{
            required: { value: true, message: 'Name is required' },
          }}
          my="14px"
        />

        <DropdownInputV2
          items={colorCodes}
          control={control}
          setValue={value => setValue('color', value)}
          name="color"
          label="Color Code"
        />
        <Box my="8px" />
        <TextAreaInput
          control={control}
          name="description"
          label="Description"
          placeholder="Enter description"
        />

        <Button
          isLoading={isLoading}
          mt="50px"
          mb="20px"
          _text={{ color: 'white', fontSize: '16px' }}
          onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default TransactionCategoryModal
