import React, { useEffect, useState } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import XIcon from '~assets/svg/wallet-x.svg'
import { Pressable } from 'react-native'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import SwipableModal from '~components/modals/SwipableModal'
import { NotificationSectionItemType } from '~types'
import SubmitModalButton from '~components/buttons/SubmitModalButton'
import {
  useGetWalletUser,
  useUpdateNotificationSettingsMutation,
} from '~api/wallet'

import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'

type Props = {
  isOpen: boolean
  hideModal: () => void
  item?: NotificationSectionItemType
}

const validateNumber = (value: string) => {
  const regex = /^[0-9+]*$/
  return regex.test(value) || 'Only numbers allowed'
}

const NotificationModal = (p: Props) => {
  const { item } = p

  const { control, setValue, getValues, handleSubmit } = useForm()
  const [selectedValue, setSelectedValue] = useState('')
  const { data } = useGetWalletUser()
  const user_uuid = data.data.uuid
  const { mutate, isLoading } = useUpdateNotificationSettingsMutation()

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<optionsType[]>([])

  const closeModal = () => {
    p.hideModal()
  }

  useEffect(() => {
    if (item && item.setting && item.id) {
      setValue(item.id, item.setting?.value)
    }
  }, [item])

  const onSubmit = data => {
    const inputValue = item?.id ? getValues(item?.id) : null

    const payload = {
      user_uuid,
      settings: [
        ...(item?.name !== 'bill_payment_alert'
          ? [
              {
                name: item?.isEditable ? item?.name : item?.limitName,
                value: inputValue,
              },
            ]
          : []),

        ...(!item?.isEditable
          ? [
              {
                name: item?.name,
                value: 1,
              },
            ]
          : []),
      ],
    }
    // console.log('Payload', payload)
    mutate(payload, {
      onSuccess: () => {
        closeModal()
        queryClient.invalidateQueries(walletQKeys.notificationSettings)
      },
    })
  }

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      {/* <ModalHandle style={{ top: -20, position: 'relative' }} /> */}
      <Box paddingX="16px" paddingBottom="30px" top="-20px">
        <HStack mb="10px" alignItems="center" justifyContent="space-between">
          <Text color="charcoal" fontSize="20px" lineHeight="30px">
            {item?.label}
          </Text>
          <Pressable onPress={closeModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        {!item?.isEditable ? (
          <Text fontSize="16px" color={'grey'} mb={'20px'}>
            Send when {item?.singular?.toLocaleLowerCase()} exceeds
          </Text>
        ) : null}
        {item?.isEditable && item.id ? (
          <Box mt={'20px'}>
            {/* <Text>Bank</Text> */}
            <DropDownPicker
              searchable
              control={control}
              value={selectedValue}
              open={open}
              options={item?.options ?? []}
              setOptions={setOptions}
              setValue={setSelectedValue}
              setOpen={setOpen}
              rules={{
                required: {
                  value: true,
                  message: `${item?.singular} is required`,
                },
              }}
              name={item.id}
            />
          </Box>
        ) : (
          <Box mt={'20px'}>
            <CommonInput
              control={control}
              label={`${item?.singular} exceeds`}
              name={item?.id}
              mt="24px"
              rules={{
                required: { value: true, message: 'Amount is required' },
                validate: validateNumber,
              }}
            />
          </Box>
        )}
        <SubmitModalButton
          mt="36px"
          onPress={handleSubmit(onSubmit)}
          title="Save"
          loading={isLoading}
        />
      </Box>
    </SwipableModal>
  )
}

export default NotificationModal
