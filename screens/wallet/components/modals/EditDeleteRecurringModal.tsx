import React from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import { Pressable } from 'react-native'
import SwipableModal from '~components/modals/SwipableModal'
import { IRecurringPayment } from '~screens/wallet/types'
import PauseIcon from '~assets/svg/pause-action.svg'
import CancelIcon from '~assets/svg/cancel.svg'
import { useDeleteRecurringPayment } from '~api/wallet'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import { useNavigation } from '@react-navigation/native'

type Props = {
  isOpen: boolean
  hideModal: () => void
  item: IRecurringPayment | undefined
  action: 'pause' | 'delete' | null
}

const EditDeleteRecurringModal = (p: Props) => {
  const navigation = useNavigation()
  const { mutate, isLoading } = useDeleteRecurringPayment()
  const closeModal = () => {
    p.hideModal()
  }

  const handleBtnClick = () => {
    const uuid = p.item?.uuid as unknown as string
    if (p.action === 'delete') {
      mutate(uuid, {
        onSuccess: () => {
          queryClient.invalidateQueries(walletQKeys.recurring)
          navigation.goBack()
        },
      })
    }
  }

  let headLabel = '-'
  let subHead = '-'
  let Icon = PauseIcon

  switch (p.action) {
    case 'delete':
      headLabel = 'Delete recurring payment'
      subHead = 'You are about to delete your recurring payment'
      Icon = CancelIcon
      break
    case 'pause':
      headLabel = 'Pause recurring payment'
      subHead = 'You are about to pause your recurring payment'
      Icon = PauseIcon
      break
    default:
      break
  }

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      <Box paddingX="16px" paddingBottom="30px" top="-20px">
        <HStack mb="40px" alignItems="center" justifyContent="space-between">
          <Text color="charcoal" fontSize="20px" lineHeight="30px">
            {headLabel}
          </Text>
          <Pressable onPress={closeModal}>
            <XIcon color="#253545" />
          </Pressable>
        </HStack>
        <Box>
          <Icon />
        </Box>
        <Text
          color="charcoal"
          fontFamily="heading"
          marginTop="10px"
          mb="12px"
          fontSize="18px"
          lineHeight={'30px'}>
          {subHead}
        </Text>
        <Button isLoading={isLoading} onPress={handleBtnClick}>
          Confirm
        </Button>

        <Button
          mt="36px"
          height="46px"
          onPress={p.hideModal}
          backgroundColor="white"
          borderColor="green.50"
          borderWidth="1px"
          _text={{ color: 'green.50' }}>
          cancel
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default EditDeleteRecurringModal
