import React, { useState } from 'react'
import { Box, HStack, Text, Button, ScrollView, Heading } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import { useForm } from 'react-hook-form'
import XIcon from '~assets/svg/wallet-x.svg'
import { Alert, Pressable } from 'react-native'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { createPickerItems } from '~utils/createPickerItems'
import { useNavigation } from '@react-navigation/native'
import SwipableModal from '~components/modals/SwipableModal'
import DateInput from '~components/date/DateInput'
import InfoIcon from '~assets/svg/info-solid.svg'
import { useGetWpPayPoints } from '~api/general'
import { filter, isEmpty, noop } from 'lodash'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'
import WAlletFileBtn from '../WalletFileBtn'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import { isIos } from '~utils/platforms'
import { getFormData } from '~utils/appUtils'
import { useFundWalletBank } from '~api/wallet'
import { formatDate } from '~utils/date'
import DocumentPlaceHolder from '~screens/document/components/DocumentPlaceHolder'
import OptInImg from '~assets/svg/optin-success.svg'
import WalletCommonModal from './WalletCommonModal'
import { useMyProfile } from '~api/account'

type Props = {
  isOpen: boolean
  hideModal: () => void
  amount: string
}

const ProofOfPaymentModal = (p: Props) => {
  const { control, setValue, handleSubmit } = useForm()
  const { data: topUpBanks } = useGetWpPayPoints()
  const { wallet } = useWalletStatus()
  const [docModal, setDocModal] = useState(false)
  const [documentName, setDocumentName] = useState('')
  const [doc, setDocItem] = useState<any>()
  const [successModal, setSuccessModal] = useState(false)
  const { mutate, isLoading } = useFundWalletBank()

  const { data } = useMyProfile()

  const currency_id = data?.data?.currency_id

  const navigation = useNavigation()

  const currentDate = new Date()

  const closeModal = () => {
    p.hideModal()
  }

  const topUpBanksArr = topUpBanks?.data?.data

  const formattedPoints = topUpBanksArr?.map(point => ({
    ...point,
    bank_name: point?.paypoint?.name,
  }))

  const topUpBankOptions = createPickerItems(formattedPoints, 'id', 'bank_name')
  const kesPayPoints =
    filter(topUpBankOptions, ['currency_id', currency_id]) ?? []

  const onSubmit = (data: any) => {
    if (!doc) {
      Alert.alert('Please attach a support document')
      return
    }
    const submitData = {
      ...data,
      amount: p.amount,
      wallet_id: wallet?.uuid,
      payment_method: 'BANK_TRANSFER',
      proof_of_payment: doc,
      payment_date: formatDate(data?.payment_date, 'backend'),
    }

    const formData = getFormData({
      ...submitData,
    })

    mutate(formData, {
      onSuccess: () => {
        setSuccessModal(true)
      },
      onError: error => {
        console.log(error?.response)
        p.hideModal()
      },
    })

    return
  }

  const handleFileUpload = (file: any) => {
    if (!file) return
    const fileData = {
      name: file.name,
      type: file.type,
      uri: file.uri,
    }
    setDocumentName(file.name)
    setDocItem(fileData)
  }

  const handleSetPhoto = (photo: any) => {
    if (!photo) return
    const photoData = {
      name: photo.fileName,
      type: photo.type,
      uri: isIos ? photo.uri.replace('file://', '') : photo.uri,
    }
    setDocumentName(photo.fileName)
    setDocItem(photoData)
  }

  const handleContinue = () => navigation.navigate('Wallet')

  return (
    <SwipableModal isOpen={p.isOpen} onHide={p.hideModal}>
      {/* <ModalHandle style={{ top: -20, position: 'relative' }} /> */}
      <Box paddingX="16px" paddingBottom="20px" top="-20px">
        <ScrollView>
          <HStack mb="20px" alignItems="center" justifyContent="space-between">
            <Text color="charcoal" fontSize="20px" lineHeight="30px">
              Upload proof of payment
            </Text>
            <Pressable onPress={closeModal}>
              <XIcon color="#253545" />
            </Pressable>
          </HStack>
          <HStack
            borderColor="#3E8BEF"
            backgroundColor="#F0F4F9"
            borderWidth={1}
            borderRadius="8px"
            paddingY="10px"
            paddingLeft="16px"
            paddingRight="40px"
            alignItems="center"
            marginBottom="16px">
            <InfoIcon />
            <Text marginLeft="16px" lineHeight="22px" fontSize="14px">
              Upload your proof of payment with your reference number
            </Text>
          </HStack>
          <DropdownInputV2
            label="Bank name"
            control={control}
            name="bank_id"
            items={kesPayPoints}
            setValue={value => setValue('bank_id', value as string)}
            rules={{
              required: { value: true, message: 'Bank is required' },
            }}
          />
          <Box marginY="8px" />
          <DateInput
            control={control}
            name="payment_date"
            label="Date of payment"
            rules={{
              required: { value: true, message: 'Date is required' },
            }}
            maximumDate={currentDate}
          />

          <CommonInput
            control={control}
            label="Payment reference number"
            name="payment_reference"
            mt="12px"
            rules={{
              required: {
                value: true,
                message: 'Reference number is required',
              },
            }}
          />
          <Box my="10px" />
          {isEmpty(documentName) ? (
            <WAlletFileBtn onPress={() => setDocModal(true)} />
          ) : (
            <DocumentPlaceHolder name={documentName} />
          )}
        </ScrollView>
        <Button
          mt="36px"
          height="46px"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}>
          Upload
        </Button>
        <DocumentPickerModal
          onUserCanceled={() => setDocModal(false)}
          isVisible={docModal}
          hideModal={() => setDocModal(false)}
          onBackdropPress={() => setDocModal(false)}
          // showCamera
          allowFiles
          setFile={noop}
          setFileItem={file => handleFileUpload(file)}
          setPhotoURI={noop}
          setPhotoItem={photo => handleSetPhoto(photo)}
        />
        <WalletCommonModal visible={successModal} setVisible={setSuccessModal}>
          <Box flex={1} alignItems="center" justifyContent="center">
            <Box my="15px">
              <OptInImg />
            </Box>
            <Heading color="white" fontSize="24px" textAlign="center">
              Proof of payment uploaded
            </Heading>
            <Text
              textAlign="center"
              fontSize="16px"
              lineHeight="24px"
              color="white"
              marginX={'10px'}
              marginTop="10px">
              Once confirmed {p.amount} will be added to your wallet
            </Text>
          </Box>

          <Button
            backgroundColor="#387E1B"
            onPress={handleContinue}
            isLoading={isLoading}>
            <Text color="white" fontSize="18px">
              Done
            </Text>
          </Button>
        </WalletCommonModal>
      </Box>
    </SwipableModal>
  )
}

export default ProofOfPaymentModal
