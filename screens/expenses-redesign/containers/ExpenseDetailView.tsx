import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Heading, HStack, Progress, ScrollView, Text, VStack, Divider } from 'native-base';
import DetailItem from '~components/DetailItem';
import { dateToString } from '~utils/date';
import ExpenseStatusFormatter, { ExpenseStatusFormatterText, ExpenseUtilityStatusFormatter } from '../components/statusFormatter';
import { FileScrollView, getFileNameFromUrl } from '~components/FilesScrollView';
import { noop, omit, set, trim } from 'lodash';
import { EditExpensePayload, ExpensePayload, TExpenseHookForm, TExpenseItem, TImprestAttachement } from '../types';
import BadgeButton from '~components/buttons/BadgeButton';
import PlusIcon from '~assets/svg/plus.svg';
import BigDot from '~components/BigDot';
import ExpenseReceiptList from '../components/ExpenseReceipts';
import DocumentPickerModal from '~components/modals/DocumentPickerModal';
import { useNavigation } from '@react-navigation/native';
import { FileData } from '~types';
import { analyticsTrackEvent } from '~utils/analytics';
import { AnalyticsEvents } from '~utils/analytics/events';
import { Platform, Pressable } from 'react-native';
import { useExpensesEditMutation } from '~api/expenses';
import { useForm } from 'react-hook-form';
import LoadingModal from '~components/modals/LoadingModal';
import { queryClient } from '~ClientApp';
import { expenseQKeys } from '~api/QueryKeys';
import { useSelector } from 'react-redux';
import { State } from '~declarations';
import InfoModal from '~components/modals/InfoModal';
import LeaveStagesBadge from '~screens/leaves-redesign/component/LeaveStagesBadge';
import HelpQuestionSvg from '~assets/svg/help-question.svg'
import DetailItemVstack from '~components/DetailItemVstack';
import { currencyDisplayFormatter } from '~utils/appUtils';
import BottomModalFilesExpense from '~components/modals/BottomModalFilesExpense';
import FileViewer from 'react-native-file-viewer'
import RNFS from 'react-native-fs'
import { fileTypes } from '../components/FileScrollViewList';

const ExpenseDetailView = () => {
  const navigation = useNavigation();
  const { expenseItem: item } = useSelector((state: State) => state.expenses)

  const isImprest = item?.is_imprest;
  const [isReceipts, setIsReceipts] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [docModal, setDocModal] = React.useState(false);
  const [filesModal, setFilesModal] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [showEditInfoModal, setShowEditInfoModal] = useState(false)
  const [uploadingNewFile, setUploadingNewFile] = useState(false)
  const [editingReceiptId, setEditingReceiptId] = useState<number | null>(null)
  const [files, setFiles] = React.useState<FileData[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = React.useState(0);
  const [prevReceipts, setPrevReceipts] = React.useState<FileData[]>([])
  const [prevReceiptIndex, setPrevReceiptIndex] = React.useState<number | null>(0)
  const [currentFileType, setCurrentFileType] = React.useState<fileTypes | null>(null)
  const [editClaimAmount, setEditClaimAmount] = useState<
    string | number | null
  >(null)
  const [successModal, setSuccessModal] = React.useState(false)

  const {
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<TImprestAttachement>()

  const amount = watch('amount')

  const editExpensesMutation = useExpensesEditMutation()

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


  useEffect(() => {
    if (item?.with_valid_receipts) {
      setPrevReceipts(item?.with_valid_receipts)
    }
  }, [item])


  const handleRemoveReceipt = (id: number) => {
    const newReceipts = [...item?.with_valid_receipts]
    const index = newReceipts.findIndex((a) => a.id === id)

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

      const filteredPrevReceipts = newPrevReceipts.filter((a) => a.id !== editingReceiptId)
      payload['previous_receipts'] = JSON.stringify(filteredPrevReceipts)
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
            setFilesModal(false)

          },
        },
      )

    }
  }

  const handleSubmitOnRemoveReceipt = (newReceipts) => {
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
          setUploadingNewFile(false)
        },
        onError: (e) => {
          setSuccessModal(false)
          setFilesModal(true)
        },
      },
    )
  }

  const handleEditReceipt = (id: number) => {
    if (!id) return

    const newReceipts = [...item?.with_valid_receipts]
    setIsEditing(true)
    setEditingReceiptId(id)
    const index = newReceipts.findIndex((a) => a.id === id)
    if (index === -1) return
    const receipt = newReceipts[index]
    setFilesModal(true)
    setUploadingNewFile(true)
    setEditClaimAmount(receipt.amount)
    setCurrentFileIndex(index)
    setPrevReceiptIndex(index)
    setCurrentFileType(fileTypes.RECEIPT)

  }

  const handleView = async (file, type) => {

    try {
      if (type == fileTypes.ATTACHMENT) {
        await FileViewer.open(file.uri)
      } else if (type == fileTypes.RECEIPT) {

        handleDowload(file)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDowload = async file => {
    setLoading(true)
    try {
      const url = file.attachment
      const fileName = getFileNameFromUrl(file.attachment)
      const urlEncoded = encodeURI(url)

      const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`
      const options = {
        fromUrl: urlEncoded,
        toFile: localFile,
      }
      await RNFS.downloadFile(options).promise
      setLoading(false)
      await FileViewer.open(localFile)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const progressValue = (parseInt(item?.spent_amount) / parseInt(item?.amount)) * 100
  const isAvailable = parseInt(item?.available_amount) > 0
  const isMobilePayment = item?.payment_method === 'MPESA' || item?.payment_method === 'MTN' || item?.payment_method === 'TIGO'
  const isBankPayment = item?.payment_method === 'BANK'

  return (
    <Box >
      <ScrollView>
        {/* Tabs Section */}
        <Box mt="24px">
          {isImprest ? <HStack alignItems="center" mb="12px">
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
          </HStack> : null}

          {!isReceipts ? (
            <Box pb={'50px'}>
              <HStack alignItems="center" justifyContent={'space-between'}>
                <VStack alignItems={'center'} mr={'auto'}>
                  <Text
                    color="charcoal"
                    fontSize="24px"
                    mr="auto"
                    alignSelf="center"
                    maxW="85%"
                    fontFamily="heading"
                  >
                    {item?.title}
                  </Text>
                  <Text fontSize="16px" color="charcoal" mr={'auto'}>
                    {item?.is_imprest ? 'Imprest' : 'Standard'} {` expense`}
                  </Text>

                  <Text fontSize="16px" color="charcoal" mr={'auto'}>
                    {trim(dateToString(item?.expense_date, 'MMM do, yyyy') ?? '-')}
                  </Text>
                </VStack>
                <ExpenseStatusFormatter status={item?.status} />

              </HStack>
              <Box>
                {isImprest ? <VStack py="20px" alignItems="flex-start">
                  <Text fontSize={'14px'} color={'grey'} mb={'10px'}>
                    Status
                  </Text>
                  <ExpenseUtilityStatusFormatter status={item?.utility_status} />
                </VStack> : null}

              </Box>


              <DetailItemVstack label='Amount' value={item?.currency_code + ' ' + currencyDisplayFormatter(item?.amount)} />

              {/* Expense Details */}
              <DetailItemVstack label="Category" value={item?.sub_category ?? '-'} />

              <DetailItemVstack
                label="Payment Status"
                value={ExpenseStatusFormatterText(item?.status)}
              />

              <Text mt="20px" mb="4px">
                Notes
              </Text>
              <Text fontSize="16px" color="charcoal" fontFamily="heading">
                {item?.description}
              </Text>
              <Divider my="10px" />
              {(!isImprest && item?.with_valid_receipts?.length > 0) ? (<>
                <Text color="charcoal" fontSize="16px" fontFamily={'heading'} mr={'4px'}>
                  Receipts
                </Text>

                <ExpenseReceiptList receipts={item?.with_valid_receipts}
                  handleRemoveReceipt={handleRemoveReceipt}
                  handleEditReceipt={handleEditReceipt}
                  handleViewReceipt={handleView}
                  currencyCode={item?.currency_code}
                />

              </>) : null}

              <HStack mt="20px" alignItems="center" >
                <Text color="charcoal" fontSize="16px" fontFamily={'heading'} mr={'4px'}>
                  Payment Details
                </Text>

              </HStack>


              <Text color="grey" fontSize="16px" mt="10px">
                {isMobilePayment ? item?.recipient_name : item?.recipient_name}
              </Text>
              <HStack mt="10px" alignItems="center">
                <Text color="grey" fontSize="16px" mr={'4px'}>
                  {isMobilePayment ? item?.payment_method : isBankPayment ? item?.bank_name : item?.payment_method}
                </Text>
                <BigDot bgColor="grey" />
                <Text color="charcoal" fontSize="16px" ml={'4px'}>
                  {isMobilePayment ? (item?.recipient_mobile_number || item?.mobile) : item?.acc_no}
                </Text>
              </HStack>
              <Divider my="10px" />



              <HStack mt="20px" alignItems="center" >
                <Text color="charcoal" fontSize="16px" fontFamily={'heading'} mr={'4px'}>
                  Approval Details
                </Text>
                <Pressable onPress={() => setShowInfoModal(true)}>
                  <HelpQuestionSvg />
                </Pressable>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between" my={'10px'}>
                <Text fontSize="14px" color="grey">
                  Approval Stage
                </Text>
                <LeaveStagesBadge item={item} />
              </HStack>

              {/* approval stages */}
              {
                item.approved_attempts.map((stage, index) => (
                  <VStack key={index} mt={'8px'} space={2}>
                    <Text fontSize="14px" color="grey">
                      Approver {index + 1}
                    </Text>
                    <HStack alignItems="center" justifyContent="space-between" mt={'5px'} key={index}>

                      {/* <UserAvatar fallback="WP" width="48px" url={stage.approver_avatar} /> */}
                      <Text fontSize="16px" color="charcoal" w={'50%'}>
                        {stage.user_name ?? '-'}
                      </Text>
                      <Badge variant={stage.action_taken === 'REJECTED' ? 'failed' : stage.action_taken === 'APPROVED' ? 'success' : 'pending'} >{stage.action_taken}</Badge>
                    </HStack>
                    <Divider />
                  </VStack>
                ))
              }
            </Box>
          ) : (
            <Box mt="10px">
              {/* Expense Amount and Progress Section */}
              <Box my="4" alignItems="center">
                <HStack justifyContent="space-between" width="full" alignItems="center">
                  <VStack alignItems="flex-start">
                    <Text fontSize="14px" color="grey">Expense Amount</Text>
                    <Heading fontSize="24px">{item?.currency_code} {item?.amount}</Heading>
                  </VStack>
                  <Button
                    borderRadius="4px"
                    my="auto"
                    px="14px"
                    disabled={!isAvailable}
                    background={!isAvailable ? 'green.30' : 'green.50'}
                    leftIcon={<PlusIcon color="white" />}
                    h="40px"
                    onPress={() => {
                      setIsEditing(false)
                      setValue('amount', '')
                      setFilesModal(true)
                      setEditClaimAmount(null)
                    }}
                  >
                    Add Receipt
                  </Button>
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
              <HStack mt="2" width="full" >
                <BigDot bgColor="green.50" />
                <Text color="grey" mx="4px">Spent {item?.currency_code} {item?.spent_amount}</Text>
                <BigDot bgColor="grey" />
                <Text color="grey" mx="4px">Available {item?.currency_code} {item?.available_amount}</Text>
              </HStack>
              <Box mt="20px" />
              <HStack justifyContent="space-between" alignItems="center" mb="12px">
                <Text fontSize="20px" fontWeight="bold">
                  Your spend
                </Text>
                <Text fontSize="20px" fontWeight="bold" color="charcoal">
                  {item?.currency_code} {item?.spent_amount}
                </Text>
              </HStack>
              <ExpenseReceiptList receipts={item?.with_valid_receipts}
                handleRemoveReceipt={handleRemoveReceipt}
                handleEditReceipt={handleEditReceipt}
                handleViewReceipt={handleView}
              />
            </Box>
          )}


          <InfoModal
            title={''}
            description={
              'Shows the number of approvals required and the specific stage the request is currently at'
            }
            isVisible={showInfoModal}
            hideModal={() => setShowInfoModal(false)}
            onConfirm={() => setShowInfoModal(false)}
            loading={false}

          />
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
            allowFiles
          />

          <BottomModalFilesExpense
            title={isEditing ? 'Edit Receipt' : 'Add Receipt'}
            message=""
            btnLabel="Back to module"
            onPressBtn={() => {

              setFilesModal(false)
              navigation.goBack()
            }}
            files={files}
            currentFileIndex={currentFileIndex}
            prevReceiptIndex={prevReceiptIndex}
            setPrevReceipts={setPrevReceipts}
            setPrevReceiptIndex={setPrevReceiptIndex}
            prevReceipts={prevReceipts}
            currentFileType={currentFileType}
            setFiles={setFiles}
            isOpen={filesModal}
            onHide={() => setFilesModal(false)}
            control={control}
            editAmount={editClaimAmount}
            closeIcon
            onSubmit={handleSubmit(onSubmit)}
            onPressUploadFile={() => {
              setFilesModal(false)
              setTimeout(() => {
                setDocModal(true)
              }, 1000)
            }}
            uploadingNewFile={uploadingNewFile}
            hasSubmit
            receiptAmount={item?.amount}
          />



          {/* File ScrollView Section */}
          <Box mt="10px">
            {/* {!isImprest ? <FileScrollView
              files={[]}
              receipts={item?.with_valid_receipts ?? []}
              setFiles={noop}
              setPrevReceipts={noop}
              hasDelete={false}
            /> : null} */}
          </Box>
          <LoadingModal
            isVisible={editExpensesMutation.isLoading || loading}
            message={
              editExpensesMutation.isLoading
                ? 'Updating Expense...'
                : 'Loading...'
            }
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ExpenseDetailView;
