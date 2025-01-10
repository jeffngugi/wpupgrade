import React from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import { Box, Button, HStack, Pressable, Text } from 'native-base'
import XIcon from '~assets/svg/wallet-x.svg'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'

type Props = {
  isOpen: boolean
  hideModal: () => void
}

const WalletConfirmPinModal = (p: Props) => {
  const { control, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <SwipableModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box px="16px" flex={1}>
        <HStack alignItems="center" mb="24px">
          <Pressable onPress={p.hideModal}>
            <XIcon color="#253545" />
          </Pressable>
          <Text color="charcoal" fontSize="20px" lineHeight="30px" ml="68px">
            Security Question
          </Text>
        </HStack>
        <Text
          mb="32px"
          fontFamily="title"
          lineHeight="24px"
          fontSize="16px"
          color="charcoal">
          What is your favorite food?
        </Text>
        <CommonInput control={control} name="answer" label="Answer" />
        <Button mt="150px" mb="40px" onPress={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </Box>
    </SwipableModal>
  )
}

export default WalletConfirmPinModal
