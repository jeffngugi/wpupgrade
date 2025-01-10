import React, { useState } from 'react'
import { Box, Button, Text, useToast } from 'native-base'
import { useForm } from 'react-hook-form'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { useCreateTransactionCategory, useGetWalletUser } from '~api/wallet'
import TextAreaInput from '~components/inputs/TextAreaInput'
import CommonInput from '~components/inputs/CommonInput'
import ScreenHeader from '~components/ScreenHeader'
import SubmitButton from '~components/buttons/SubmitButton'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import { WalletRoutes } from '~types'

export const colorCodes = [
  {
    label: 'Green',
    value: '#62A446',
  },
  { label: 'Blue', value: '#0D6AE3' },
  { label: 'Orange', value: '#EDA418' },
]

type NavigationProps = {
  navigation: any
}

const AddTransactionCategory = ({ navigation }: NavigationProps) => {
  const { control, handleSubmit, setValue } = useForm()
  const [successModal, setSuccessModal] = useState(false)
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData.data.uuid

  const { mutate, isLoading } = useCreateTransactionCategory()
  const toast = useToast()

  const onSubmit = data => {
    const submitData = {
      user_uuid: uuid,
      ...data,
    }

    mutate(submitData, {
      onSuccess: data => {
        setSuccessModal(true)
      },
    })
  }
  return (
    <Box safeArea px="16px" backgroundColor="white" flex={1}>
      <ScreenHeader
        title="Add Transaction Category"
        onPress={() => navigation.goBack()}
      />
      <Box top="10px"></Box>
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
      <Text
        fontFamily="body"
        fontSize="14px"
        color="grey"
        mb="5px"
        lineHeight="22px">
        Color Code
      </Text>
      <DropdownInputV2
        items={colorCodes}
        control={control}
        setValue={value => setValue('color', value)}
        name="color"
      />
      <Box my="8px" />
      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter description"
      />
      <SuccessModal
        title={'Transaction Category created successfully'}
        message=""
        btnLabel={'Back to module'}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.navigate(WalletRoutes.TransactionCategories)
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal
        message="Submitting transactio category..."
        isVisible={isLoading}
      />
      <Box my="8px" flex={1} />
      <SubmitButton
        loading={isLoading}
        title="Submit"
        onPress={handleSubmit(onSubmit)}
      />
    </Box>
  )
}

export default AddTransactionCategory
