import React, { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Progress,
  ScrollView,
  Text,
  VStack,
  Divider,
  Menu,
  Pressable,
} from 'native-base'
import DetailItem from '~components/DetailItem'
import { dateToString } from '~utils/date'
import ExpenseStatusFormatter, {
  ExpenseStatusFormatterText,
  ExpenseUtilityStatusFormatter,
  ExpenseVerificationStatusFormatter,
} from '../components/statusFormatter'
import { FileScrollView } from '~components/FilesScrollView'
import { isEmpty, noop, omit, set } from 'lodash'
import {
  EditExpensePayload,
  ExpensePayload,
  TExpenseHookForm,
  TExpenseItem,
  TImprestAttachement,
} from '../types'
import BadgeButton from '~components/buttons/BadgeButton'
import PlusIcon from '~assets/svg/plus.svg'
import BigDot from '~components/BigDot'
import ExpenseReceiptList from '../components/ExpenseReceipts'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import { useNavigation } from '@react-navigation/native'
import { FileData } from '~types'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import { Platform } from 'react-native'
import { useExpensesEditMutation, useSupportingDocumentDeleteMutation, useVerifyImprest } from '~api/expenses'
import { useForm } from 'react-hook-form'
import BottomModalFilesImprest from '~components/modals/BottomModalFilesImprest'
import LoadingModal from '~components/modals/LoadingModal'
import { queryClient } from '~ClientApp'
import { expenseQKeys } from '~api/QueryKeys'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import InfoModal from '~components/modals/InfoModal'
import MoreICon from '~assets/svg/more-vertical.svg'
import BottomModalFilesImprestVerification from '~components/modals/BottomModalFilesImprestVerification'
import { statusMapper } from '../constants'
import { useMyProfile } from '~api/account'

const ExpenseDetailView = () => {
  const navigation = useNavigation()
  const { expenseItem: item } = useSelector((state: State) => state.expenses)
  const [activeBadge, setActiveBadge] = React.useState('expenseDetails')
  const isImprest = item?.is_imprest
  const [isReceipts, setIsReceipts] = useState(false)
  const [requestVerificationModal, setRequestVerificationModal] = useState(false)
  const {
    user: { company_id },
  } = useSelector((state: State) => state.user)

  const [docModal, setDocModal] = React.useState(false)
  const [filesModal, setFilesModal] = React.useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showEditInfoModal, setShowEditInfoModal] = useState(false)
  const [editingReceiptId, setEditingReceiptId] = useState<number | null>(null)
  const [files, setFiles] = React.useState<FileData[]>([])
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0)
  const [editClaimAmount, setEditClaimAmount] = useState<
    string | number | null
  >(null)
  const [successModal, setSuccessModal] = React.useState(false)

  const { handleSubmit, control, setError, watch, setValue } =
    useForm<TImprestAttachement>()

  const amount = watch('amount')
  console.log('amount', amount)

  const editExpensesMutation = useExpensesEditMutation()
  const requestVerificationMutation = useVerifyImprest()
  const deleteSupportingDocumentMutation = useSupportingDocumentDeleteMutation()

  const handleFileUpload = (file: FileData) => {
    if (!file) return
    const fileData: FileData = {
      name: file.name,
      type: file.type,
      category: 'doc',
      uri: file.uri,
      amount: '',
    }
    setCurrentFileIndex(files.length)
    const updatedFiles: FileData[] = [...files, fileData]
    setFiles(updatedFiles)
    analyticsTrackEvent(
      AnalyticsEvents.Expenses.select_expenses_modal_gallery,
      { name: file.name },
    )
  }

  const handleSetPhoto = (photo: FileData & { fileName: string }) => {
    if (!photo) return
    const photoData = {
      name: photo.fileName,
      type: photo.type,
      category: 'photo',
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      amount: '',
    }
    setCurrentFileIndex(files.length)
    const updatedFiles = [...files, photoData]
    setFiles(updatedFiles)
    setTimeout(() => {
      setFilesModal(true)
      analyticsTrackEvent(
        AnalyticsEvents.Expenses.open_expenses_file_amount_modal,
        {
          name: photo.fileName,
        },
      )
    }, 1000)
    analyticsTrackEvent(AnalyticsEvents.Expenses.select_expenses_modal_camera, {
      name: photo.fileName,
    })
  }

  const handleRemoveReceipt = (id: number) => {
    const newReceipts = [...item?.with_valid_receipts]
    const index = newReceipts.findIndex(a => a.id === id)

    if (index === -1) return
    newReceipts.splice(index, 1)

    setTimeout(() => {
      handleSubmitOnRemoveReceipt(newReceipts)
    }, 1000)
  }

  const onSubmit = (formData: TExpenseHookForm) => {
    // setFilesModal(false)
    analyticsTrackEvent(AnalyticsEvents.Expenses.apply_expense, {})

    const filesToUpload: Omit<FileData, 'amount'>[] = []
    const receiptAmount: number[] = []
    const receiptDate: string[] = []

    files.forEach(a => {
      filesToUpload.push(omit(a, ['amount']))
      receiptAmount.push(parseInt(a.amount))
      receiptDate.push(dateToString(new Date(), 'yyyy-MM-dd'))
    })

    const payload: any = {
      ...formData,
      is_imprest: isImprest ? 1 : 0,
      attachments: filesToUpload,
      amounts: receiptAmount,
      amount: item?.amount,
      receipt_date: receiptDate,
    }

    if (isEditing) {
      const newPrevReceipts = [...item?.with_valid_receipts]
      const indexByReceiptId = newPrevReceipts.findIndex(
        a => a.id === editingReceiptId,
      )
      if (indexByReceiptId !== -1) {
        newPrevReceipts.splice(indexByReceiptId, 1)
      }
      payload['previous_receipts'] = JSON.stringify(newPrevReceipts)
    }

    if (Object.keys(item).length > 0) {
      const editPayLoad: Partial<EditExpensePayload> = { ...payload }
      const id = item?.id
      editPayLoad['action'] = 'update'
      editPayLoad['id'] = id
      // editPayLoad['dr'] = `${category}`
      delete editPayLoad['category']
      editExpensesMutation.mutate(
        { id, payload: editPayLoad },
        {
          onSuccess: () => {
            setFiles([])
            setSuccessModal(true)
            setFilesModal(false)
            setValue('amount', '')
            setIsEditing(false)
          },
          onError: () => {
            // setFiles([])
            setSuccessModal(false)
            setFilesModal(true)
          },
        },
      )
    }
  }

  const handleSubmitOnRemoveReceipt = newReceipts => {
    const prevReceipts = newReceipts
    const payload = {
      previous_receipts: JSON.stringify(prevReceipts),
    }
    const editPayLoad: Partial<EditExpensePayload> = { ...payload }
    const id = item?.id
    editPayLoad['action'] = 'update'
    editPayLoad['id'] = id
    editPayLoad['amount'] = item?.amount
    editExpensesMutation.mutate(
      { id, payload: editPayLoad },
      {
        onSuccess: () => {
          setFiles([])
          setSuccessModal(true)
          console.log('success')
          queryClient.invalidateQueries([expenseQKeys.expenses])
        },
        onError: e => {
          setSuccessModal(false)
          setFilesModal(true)
        },
      },
    )
  }

  const handleRemoveSupportingDocumentApi = (file) => {

    const payload = {
      auth_company_id: company_id,
      expense_id: item?.id,
      supporting_document_id: file.id,
    }
    deleteSupportingDocumentMutation.mutate(payload, {
      onSuccess: () => {

        queryClient.invalidateQueries([expenseQKeys.expenses])
      },
      onError: () => {
        setSuccessModal(false)
      },
    })
  }


  const handleSubmitVerifyImprest = (formData) => {

    const payload: any = {
      ...formData,
      imprest_id: item?.id,
    }

    if (Object.keys(item).length > 0) {
      const editPayLoad: Partial<EditExpensePayload> = { ...payload }
      const id = item?.id
      editPayLoad['action'] = 'update'
      editPayLoad['id'] = id
      editPayLoad['imprest_id'] = id

      if (isEmpty(formData.reason)) {
        delete editPayLoad['reason']
      }

      // editPayLoad['dr'] = `${category}`
      delete editPayLoad['category']
      requestVerificationMutation.mutate(
        editPayLoad,
        {
          onSuccess: () => {
            setFiles([])
            setSuccessModal(true)
            setRequestVerificationModal(false)
            // setValue('reason', '')
            setIsEditing(false)
          },
          onError: () => {
            // setFiles([])
            setSuccessModal(false)
            setRequestVerificationModal(true)
          },
        },
      )
    }
  }

  const requestConfirmEdit = (id: number) => {
    setShowEditInfoModal(true)
    setEditingReceiptId(id)
  }

  const handleEditReceipt = () => {
    if (!editingReceiptId) return
    const newReceipts = [...item?.with_valid_receipts]
    setIsEditing(true)
    const index = newReceipts.findIndex(a => a.id === editingReceiptId)
    if (index === -1) return
    const receipt = newReceipts[index]
    // setFilesModal(true)
    setEditClaimAmount(receipt.amount)
    setCurrentFileIndex(index)
    setTimeout(() => {
      setDocModal(true)
    }, 1000)
  }

  const progressValue =
    (parseInt(item?.spent_amount) / parseInt(item?.amount)) * 100
  const isAvailable = parseInt(item?.available_amount) > 0

  const showRequestVerification = item?.status === 'PAID' && item?.is_approved && item?.verification_status === null

  const RightItem = (
    { handlePress }:
      { handlePress: (type: string) => void }
  ) => (
    <Menu
      w="190"
      defaultIsOpen={false}
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <MoreICon color="#253545" />
          </Pressable>
        )
      }}>
      <Menu.Item onPress={() => {
        setRequestVerificationModal(true)
      }}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Request Verification
        </Text>
      </Menu.Item>


    </Menu >
  )

  return (
    <Box>
      <ScrollView>
        <Box mt="24px">
          {isImprest ? (
            <HStack alignItems="center" mb="12px">
              <BadgeButton
                bgColor={!isReceipts ? 'green.50' : 'greyLabelBackground'}
                label="Expense details"
                labelColor={!isReceipts ? 'white' : 'charcoal'}
                onPress={() => setIsReceipts(false)}
              />
              <Box ml="10px" />
              <BadgeButton
                bgColor={isReceipts ? 'green.50' : 'greyLabelBackground'}
                label="Receipts"
                labelColor={isReceipts ? 'white' : 'charcoal'}
                onPress={() => setIsReceipts(true)}
              />
              <Box ml="auto" />
              {showRequestVerification ? <Box justifyContent={'flex-end'} w={'12px'}>
                <RightItem handlePress={handleEditReceipt} />
              </Box>
                : null}
            </HStack>
          ) : null}
          {/* {has} */}

          {!isReceipts ? (
            <Box>
              <HStack alignItems="center">
                <Text
                  color="charcoal"
                  fontSize="24px"
                  mr="auto"
                  alignSelf="center"
                  width="80%"
                  fontFamily="heading">
                  {item?.title}
                </Text>
                {isImprest ? <ExpenseUtilityStatusFormatter status={item?.utility_status} /> : null}
              </HStack>
              <Box>
                <VStack py="20px" alignItems="flex-start">
                  <Text fontSize={'14px'} color={'grey'} mb={'10px'}>
                    Status
                  </Text>
                  <Text fontSize="16px" color={'charcoal'}>
                    <ExpenseStatusFormatter status={item?.status} />
                  </Text>
                </VStack>
                <Divider />
              </Box>
              <HStack alignItems="center" my="4px">
                <Text fontSize="20px" color="charcoal">
                  {item.currency_code} {item?.amount}
                </Text>
              </HStack>

              {/* Expense Details */}
              <DetailItem label="Category" value={item?.sub_category ?? '-'} />
              <DetailItem
                label="Expense Date"
                value={dateToString(item?.expense_date, 'MMM do, yyyy') || '-'}
              />
              <DetailItem
                label="Payment Status"
                value={ExpenseStatusFormatterText(item?.status)}
              />
              <DetailItem label="Payment Method" value={item?.payment_method} />
              <DetailItem
                label="Mobile notification number"
                value={item?.mobile}
              />
              <DetailItem
                label="Verification Status"
                value={ExpenseVerificationStatusFormatter({ status: item?.verification_status })}
              />

              <Text mt="20px" mb="4px">
                Notes
              </Text>
              <Text fontSize="16px" color="charcoal" fontFamily="heading">
                {item?.description}
              </Text>
              <Divider my="10px" />
              {item?.has_supporting_documents ? (
                <>
                  <Text mt="20px" mb="4px">
                    Supporting Documents
                  </Text>
                  <FileScrollView
                    files={[]}
                    receipts={item?.with_valid_supporting_documents ?? []}
                    setFiles={noop}
                    setPrevReceipts={noop}
                    hasDelete={true}
                    hasApiDelete={true}
                    onApiDelete={handleRemoveSupportingDocumentApi}
                    hasEdit={false}
                  />
                  <Box mt="10px" />
                </>
              ) : null}
            </Box>
          ) : (
            <Box mt="10px">
              {/* Expense Amount and Progress Section */}
              <Box my="4" alignItems="center">
                <HStack
                  justifyContent="space-between"
                  width="full"
                  alignItems="center">
                  <VStack alignItems="flex-start">
                    <Text fontSize="14px" color="grey">
                      Expense Amount
                    </Text>
                    <Heading fontSize="24px">
                      {item?.currency_code} {item?.amount}
                    </Heading>
                  </VStack>
                  {isAvailable ? (
                    <Button
                      borderRadius="4px"
                      my="auto"
                      px="14px"
                      colorScheme="green.50"
                      leftIcon={<PlusIcon color="white" />}
                      h="40px"
                      onPress={() => {
                        setIsEditing(false)
                        setEditingReceiptId(null)
                        setValue('amount', '')
                        setDocModal(true)
                        setEditClaimAmount(null)
                      }}>
                      Add Receipt
                    </Button>
                  ) : null}
                </HStack>
              </Box>

              <Box mt="20px" />
              <Progress
                bg="white"
                h="8px"
                value={progressValue}
                _filledTrack={{
                  bg: 'green.50',
                }}
              />
              <HStack mt="2" width="full">
                <BigDot bgColor="green.50" />
                <Text color="grey" mx="4px">
                  Spent {item?.currency_code} {item?.spent_amount}
                </Text>
                <BigDot bgColor="grey" />
                <Text color="grey" mx="4px">
                  Available {item?.currency_code} {item?.available_amount}
                </Text>
              </HStack>
              <Box mt="20px" />
              <HStack
                justifyContent="space-between"
                alignItems="center"
                mb="12px">
                <Text fontSize="20px" fontWeight="bold">
                  Your spend
                </Text>
                <Text fontSize="20px" fontWeight="bold" color="charcoal">
                  {item?.currency_code} {item?.spent_amount}
                </Text>
              </HStack>
              <ExpenseReceiptList
                receipts={item?.with_valid_receipts}
                handleRemoveReceipt={handleRemoveReceipt}
                handleEditReceipt={requestConfirmEdit}
              />
            </Box>
          )}
          <DocumentPickerModal
            onUserCanceled={() => setDocModal(false)}
            isVisible={docModal}
            hideModal={() => setDocModal(false)}
            onBackdropPress={() => setDocModal(false)}
            showCamera
            // allowFiles
            setFile={noop}
            setFileItem={file => handleFileUpload(file)}
            setPhotoURI={noop}
            setPhotoItem={photo => handleSetPhoto(photo)}
          />
          <BottomModalFilesImprest
            title={isEditing ? 'Edit Receipt' : 'Add Receipt'}
            message=""
            btnLabel="Back to module"
            onPressBtn={() => {
              setFilesModal(false)
              navigation.goBack()
            }}
            files={files}
            currentFileIndex={currentFileIndex}
            setFiles={setFiles}
            isOpen={filesModal}
            onHide={() => setFilesModal(false)}
            control={control}
            editAmount={editClaimAmount}
            closeIcon
            onSubmit={handleSubmit(onSubmit)}
          />

          <BottomModalFilesImprestVerification
            title={'Request Expense Verification'}
            message=""
            btnLabel="Back to module"
            onPressBtn={() => {
              setFilesModal(false)
              navigation.goBack()
            }}

            expenseDetail={item}
            isOpen={requestVerificationModal}
            onHide={() => setRequestVerificationModal(false)}
            control={control}
            editReason={editClaimAmount}
            closeIcon
            onSubmit={handleSubmitVerifyImprest}
            loading={requestVerificationMutation.isLoading}
          />

          <InfoModal
            title="Info"
            description="You are required to attach a new receipt to update this receipt"
            isVisible={showEditInfoModal}
            hideModal={() => {
              setShowEditInfoModal(false)
            }}
            btbLabel="Continue"
            closeIcon
            onConfirm={() => {
              setShowEditInfoModal(false)
              handleEditReceipt()
            }}
          />

          {/* File ScrollView Section */}
          {!isImprest && item?.with_valid_receipts ? (
            <Box mt="10px" mb={'60px'}>

              <>
                <Text mt="10px" mb="4px">
                  Receipts
                </Text>
                <FileScrollView
                  files={[]}
                  receipts={item?.with_valid_receipts ?? []}
                  setFiles={noop}
                  setPrevReceipts={noop}
                  hasDelete={false}
                />
              </>

            </Box>
          ) : null}

          <LoadingModal
            isVisible={editExpensesMutation.isLoading || requestVerificationMutation.isLoading || deleteSupportingDocumentMutation.isLoading}
            message="Updating expense..."
          />
        </Box>
        <Box mt="20px" />
      </ScrollView>
    </Box>
  )
}

export default ExpenseDetailView
