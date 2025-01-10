import { useForm } from 'react-hook-form'
import React, { useRef, useState } from 'react'
import {
  Text,
  Divider,
  ScrollView,
  Button,
  Box,
  Heading,
  Pressable,
  useToast,
  HStack,
} from 'native-base'
import SubmitButton from '~components/buttons/SubmitButton'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import { WalletConfirmItem } from '../SendMoneyConfirm'
import WalletPinModal from '../components/modals/WalletPinModal'
import WalletCommonModal from '../components/modals/WalletCommonModal'
import LipaIcon from '~assets/svg/success-lipa.svg'
import { InteractionManager, SafeAreaView, StyleSheet } from 'react-native'
import StarIcon from '~assets/svg/star-filled.svg'
import { currencyWithCode } from '~utils/appUtils'
import { useWalletStatus } from '../hooks/useWalletStatus'
import { isEmpty, isNull, toNumber } from 'lodash'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import XIcon from '~assets/svg/wallet-x.svg'
import {
  useCreateWalletBeneficiary,
  useGetWalletUser,
  useTransferPin,
} from '~api/wallet'
import { windowHeight } from '~utils/appConstants'
import CommonInput from '~components/inputs/CommonInput'

// Define your form types
interface FormData {
  amount: string
  name: string
}

interface Props {
  navigation: MainNavigationProp<WalletRoutes.MerchantReview>
  route: MainNavigationRouteProp<WalletRoutes.MerchantReview>
}

const PayMerchantReview = ({ navigation, route }: Props) => {
  const { merchantType, submitData, successData, recipientName } = route.params
  const { control, handleSubmit } = useForm<FormData>()
  const [confirmModal, setConfirmModal] = useState(false)
  const [pin, setPin] = useState('')
  const [successModal, setSuccessModal] = useState(false)
  const { mutate, isLoading } = useTransferPin()
  const { data: walletData } = useGetWalletUser()
  const beneficiary = useCreateWalletBeneficiary()
  const toast = useToast()
  const { wallet_account } = useWalletStatus()
  const currency = wallet_account.currency ?? ''

  const totalAmount =
    toNumber(successData?.amount) + toNumber(successData?.fees)
  const actionSheetRef = useRef<ActionSheetRef>(null)

  const openActionSheet = () => actionSheetRef.current?.show()
  const closeActionSheet = () => actionSheetRef.current?.hide()

  const onSubmit = () => {
    const submitData = {
      wallet_id: wallet_account.uuid,
      transfer_id: successData?.uuid,
      pin: pin,
    }

    mutate(submitData, {
      onSuccess: data => {
        setConfirmModal(false)
        setTimeout(() => setSuccessModal(true), 400)
      },
    })
  }

  const handlePress = handleSubmit(onSubmit)

  const handleSaveBeneficiary = (data: { name: string }) => {
    const beneficiaryData = {
      user_uuid: walletData?.data?.uuid,
      name: data?.name,
      acc_name: successData?.account_name
        ? successData?.account_name
        : data?.name,
      channel: successData?.payment_method,
      type: 'TRANSFER',
      merchant_number: submitData.merchant_number,
      ...(merchantType === 'PAYBILL' && { acc_no: submitData?.account_number }),
      ...(merchantType === 'TILL' && { acc_no: '0' }),
    }

    beneficiary.mutate(beneficiaryData, {
      onSuccess: data => {
        navigation.navigate('Wallet')
        toast.show({
          title: 'Added successfully, continue',
          placement: 'top',
        })
      },
      onSettled: () => {
        navigation.navigate('Wallet')
      },
    })
  }

  const handleContinue = () => {
    navigation.navigate(WalletRoutes.Merchant)
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <ScreenHeader
          onPress={() => navigation.goBack()}
          title="Confirm payment"
        />
        <Text fontSize="16px" mt="32px">
          Your Transfer
        </Text>
        <Divider mt="8px" mb="14px" />
        <WalletConfirmItem
          label="You pay"
          value={currencyWithCode(currency, successData?.amount)}
        />
        <WalletConfirmItem
          label="Your fees"
          value={currencyWithCode(currency, successData?.fees)}
        />
        <WalletConfirmItem
          label="Total"
          value={currencyWithCode(currency, totalAmount.toString())}
        />
        <Text fontSize="16px" mt="32px">
          Biller details
        </Text>
        <Divider mt="8px" mb="24px" />
        {!isEmpty(recipientName) ? (
          <WalletConfirmItem
            label="Name"
            value={
              isNull(recipientName) ? recipientName : submitData.merchant_number
            }
          />
        ) : null}
        <WalletConfirmItem
          label={merchantType === 'PAYBILL' ? 'Paybill number' : 'Till number'}
          value={submitData.merchant_number ?? '-'}
        />
        {merchantType === 'PAYBILL' ? (
          <WalletConfirmItem
            label="Account number"
            value={submitData?.account_number ?? '-'}
          />
        ) : null}
      </ScrollView>
      <SubmitButton onPress={() => setConfirmModal(true)} title="Pay" />
      <WalletPinModal
        btnTitle="Confirm payment"
        handlePress={handlePress}
        pin={pin}
        setPin={setPin}
        isLoading={false}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
      <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <LipaIcon />
          </Box>
          <Heading color="white" fontSize="32px" textAlign="center">
            Your payment request is successful
          </Heading>
          <Text color="white" my="5px" textAlign="center">
            You will be notified once the payment has been completed
          </Text>
          <Pressable
            flexDirection="row"
            alignItems="center"
            onPress={openActionSheet}
            backgroundColor="white"
            paddingX="12px"
            paddingY="6px"
            borderRadius="28px"
            mt="20px">
            <StarIcon color="#62A446" />
            <Text fontSize="16px" color="green.50" marginLeft="2px">
              Save merchant
            </Text>
          </Pressable>
        </Box>

        <Button backgroundColor="#387E1B" onPress={handleContinue}>
          Done
        </Button>
        <Pressable
          marginTop="30px"
          marginBottom="30px"
          paddingY="10px"
          onPress={() => navigation.navigate(WalletRoutes.Merchant)}>
          <Text color="white" textAlign="center" fontSize="16px">
            Make another payment
          </Text>
        </Pressable>
        <ActionSheet ref={actionSheetRef} containerStyle={styles.actionSheet}>
          <SafeAreaView style={styles.actionSheetContent}>
            <Box paddingX="16px" marginY="15px" marginTop="20px">
              <HStack
                mb="40px"
                alignItems="center"
                justifyContent="space-between">
                <Text color="charcoal" fontSize="20px" lineHeight="30px">
                  Add merchant name
                </Text>
                <Pressable onPress={closeActionSheet}>
                  <XIcon color="#253545" />
                </Pressable>
              </HStack>
              <CommonInput
                label="Merchant name"
                name="name"
                control={control}
                rules={{
                  required: { value: true, message: 'Name is required' },
                }}
              />
              <Box marginY="10px" />
              <SubmitButton
                title="Save"
                onPress={handleSubmit(handleSaveBeneficiary)}
              />
            </Box>
          </SafeAreaView>
        </ActionSheet>
      </WalletCommonModal>
    </ScreenContainer>
  )
}

export default PayMerchantReview

const styles = StyleSheet.create({
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionSheetContent: {
    maxHeight: windowHeight * 0.75,
  },
})
