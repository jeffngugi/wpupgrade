import _, { isNumber, noop, set, toString } from 'lodash'
import { Box, FormControl, HStack, ScrollView, Switch, Text } from 'native-base'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import PhoneInput from 'react-native-phone-number-input'
import { CountryCode } from 'react-native-country-picker-modal'
import parsePhoneNumberFromString from 'libphonenumber-js/mobile'
import { useSelector } from 'react-redux'
import { useFetchEmployeeDetails } from '~api/employees'
import {
  useExpenseCategoriesFetchQuery,
  useExpensesCreateMutation,
  useExpensesEditMutation,
  usePaymentMethods,
} from '~api/expenses'
import { useCurrencies } from '~api/general'
import DateInput from '~components/date/DateInput'
import { optionsType } from '~components/DropDownPicker'
import CommonInput from '~components/inputs/CommonInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import PhoneField from '~components/inputs/PhoneField'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import LoadingModal from '~components/modals/LoadingModal'
import SuccessModal from '~components/modals/SuccessModal'
import { State } from '~declarations'
import {
  createCurrencySelectOptionsTyped,
  createExpenseSelectOptionsTyped,
  getBankOptions,
} from '~helpers'
import { dateToString } from '~utils/date'
import { useNavigation } from '@react-navigation/native'
import { parseISO } from '~utils/date'
import { usePaypoints } from '~api/payouts/bulk'
import SubmitButton from '~components/buttons/SubmitButton'
import {
  Bank,
  EditExpensePayload,
  ExpensePayload,
  TExpenseHookForm,
  TExpenseItem,
} from '../types'
import { ExpenseRoutes, FileData, MainStackUseNavigationProp } from '~types'
import { useFetchProfile } from '~api/home'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import DocumentBoxButton from '../components/DocumentBoxBtn'
import BottomModalFilesExpense from '~components/modals/BottomModalFilesExpense'
import BottomModalFilesList from '../components/BottomModalFilesList'
import CommonInputCurrency from '~components/inputs/CommonInputCurrency'
import ActionSheetPickerSubOptions from '~components/inputs/ActionSheetPickerSubOptions'
import { STAGES } from '../RecordExpense'
import ActionSheetPicker from '~components/inputs/ActionSheetPicker'
import { fileTypes } from '../components/FileScrollViewList'
import {
  getEmployeeMobilePaymentOptions,
  getEmployeePaymentOptions,
} from '~screens/expenses/helpers'

const Statuses = {
  NOTPAID: 'NOTPAID',
  PAID: 'PAID',
}

const ExpenseForm = ({
  item: expenseDetail,
  isImprest,
  currentStage,
  setCurrentStage,
}: {
  item?: TExpenseItem
  isImprest: boolean
  currentStage: string
  setCurrentStage: (stage: string) => void
}) => {
  const navigation = useNavigation<MainStackUseNavigationProp>()

  const { data: profileInfo } = useFetchProfile()
  const country = profileInfo?.data?.country_code ?? ''
  const countryPhoneinputCode = country.slice(0, 2)

  const [docModal, setDocModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  const [showCountryPicker, setShowCountryPicker] = useState(false)

  const [category, setCategory] = useState('')

  const [categoryOptions, setCategoryOptions] = useState<optionsType[]>([])
  const [fileListModal, setFileListModal] = useState(false)

  const [files, setFiles] = useState<FileData[]>([])

  const [filesModal, setFilesModal] = useState(false)
  const [uploadingNewFile, setUploadingNewFile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [currentFileType, setCurrentFileType] = useState<fileTypes>(null)
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null)
  const [prevReceiptIndex, setPrevReceiptIndex] = useState<number | null>(null)

  const [prevReceipts, setPrevReceipts] = useState<any[]>([])
  const [editClaimAmount, setEditClaimAmount] = useState<
    string | number | null
  >(null)

  const phoneRef = useRef<PhoneInput>(null)

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setError,
    watch,
    trigger,
    setValue,
  } = useForm<TExpenseHookForm>({ mode: 'onChange' })

  const {
    user: { employee_id: employeeID, company_id: companyID, token },
  } = useSelector((state: State) => state.user)

  const expenseCategoriesFetch = useExpenseCategoriesFetchQuery({
    searchText: '',
  })

  const expenseCategoriesOptions = createExpenseSelectOptionsTyped(
    expenseCategoriesFetch?.data?.data?.data?.data ?? [],
    'id',
    'name',
    'sub_categories',
  )

  const employeeDetails = useFetchEmployeeDetails({
    id: String(employeeID),
  })

  const employeeCurrencies = useCurrencies()

  const currencyOptions = useMemo(
    () =>
      createCurrencySelectOptionsTyped(
        employeeCurrencies?.data?.data?.data?.data,
        'id',
        'name',
        'code',
      ),
    [employeeCurrencies?.data?.data?.data?.data],
  )

  const empCurrencyCode = employeeDetails?.data?.data?.data?.currency_code || ''
  const empCurrencyId = employeeDetails?.data?.data?.data?.currency_id || ''
  const empCountryId = employeeDetails?.data?.data?.data?.country_id || ''

  const currency = watch('currency')

  const empCurrencyData = currencyOptions.find(
    option => option.value === (currency || empCurrencyId),
  )
  const currencyCode = empCurrencyData?.code
  const selectedCountryCode = empCurrencyData?.country_alpha_two_code
  const paymentMethodParams = {
    currency_code: currencyCode,
    token,
    employee_id: employeeID,
  }

  const paymentMethods = usePaymentMethods(paymentMethodParams)
  const allPaymentMethods = paymentMethods?.data?.data?.data
  const paymentOptions = useMemo(
    () => getEmployeePaymentOptions(allPaymentMethods, false),
    [allPaymentMethods],
  )

  const mobilePaymentOptions = useMemo(
    () => getEmployeeMobilePaymentOptions(allPaymentMethods),
    [allPaymentMethods],
  )

  const banksQuery = usePaypoints({})
  const banks: Bank[] = banksQuery?.data?.data?.data || []

  const memoizedBankOptions = useMemo(() => getBankOptions(banks), [banks])

  const payMethod = watch('payment_method')
  const mMoneyProvider = watch('mMoneyProvider')
  const bankId = watch('bank_id')
  const selectedBank = memoizedBankOptions.find(bank => bank.value === bankId)

  /**
   * This function will be run   if we are on editing mode
   */
  const initializeEditing = () => {
    if (!expenseDetail) return
    const amount = expenseDetail.amount ? parseInt(expenseDetail.amount) : 0
    setValue('title', expenseDetail.title ?? '')
    setValue('expense_date', parseISO(expenseDetail?.expense_date))
    setValue('amount', toString(amount))

    setCategory(expenseDetail?.dr ?? '')
    setTimeout(() => {
      setValue('category', expenseDetail.dr)
      setValue('currency', expenseDetail.currency_id)
    }, 1000)

    const mobileNumberPrint = expenseDetail?.mobile?.replace('+', '')
    const parsedPhoneNumber = parsePhoneNumberFromString(
      `+${mobileNumberPrint || ''}`,
    )

    const country = parsedPhoneNumber?.country

    const nationalNumber = parsedPhoneNumber?.nationalNumber
    const countryCallingCode = parsedPhoneNumber?.countryCallingCode

    if (country && countryCallingCode && nationalNumber) {
      phoneRef.current?.setState({
        countryCode: country as CountryCode,
        code: countryCallingCode.toString(),
        number: nationalNumber,
      })
    }
    const isMobilePayment =
      expenseDetail?.payment_method === 'MPESA' ||
      expenseDetail?.payment_method === 'AIRTEL' ||
      expenseDetail?.payment_method === 'TIGO' ||
      expenseDetail?.payment_method === 'MTN'

    setTimeout(() => {
      setValue(
        'payment_method',
        isMobilePayment ? 'MOBILE_MONEY' : expenseDetail?.payment_method,
      )
      setValue('mMoneyProvider', expenseDetail?.payment_method)
      setValue('bank_id', expenseDetail?.bank_id)
      setTimeout(() => {
        setValue('branch_id', expenseDetail?.branch_id)
      }, 1000)
    }, 1400)
    setValue('recipient_number', toString(nationalNumber))
    setValue('description', expenseDetail?.description ?? '')

    if (expenseDetail?.status === Statuses.PAID) {
      setIsPaid(true)
      if (expenseDetail?.payment_date) {
        setValue('payment_date', parseISO(expenseDetail?.payment_date))
      }
    }

    setValue('acc_no', expenseDetail?.acc_no)
    setPrevReceipts(expenseDetail?.with_valid_receipts)
  }

  //setMobile money provider if current Stage is 2
  useEffect(() => {
    if (currentStage === STAGES[2] && expenseDetail?.payment_method) {
      setValue('mMoneyProvider', expenseDetail?.payment_method)
    }
  }, [currentStage])

  useEffect(() => {
    setCategoryOptions(expenseCategoriesOptions)
  }, [])

  useEffect(() => {
    if (expenseDetail) {
      initializeEditing()
    }
  }, [expenseDetail, selectedBank])

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
    // setUploadingNewFile(false)
    const updatedFiles: FileData[] = [...files, fileData]
    setFiles(updatedFiles)
    analyticsTrackEvent(
      AnalyticsEvents.Expenses.select_expenses_modal_gallery,
      { name: file.name },
    )
  }

  const handleSetPhoto = (photo: FileData & { fileName: string }) => {
    if (!photo) return
    //if isEditing remove the edited receipt based on currentF

    const photoData = {
      name: photo.fileName,
      type: photo.type,
      category: 'photo',
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      amount: '',
    }
    setCurrentFileIndex(files.length)
    // setUploadingNewFile(false)
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

  const createExpenseMutation = useExpensesCreateMutation()
  const editExpensesMutation = useExpensesEditMutation()

  const validatePartially = async (fields: Array<keyof TExpenseHookForm>) => {
    // Trigger validation only for specific fields
    const result = await trigger(fields)
    return result
  }

  const continueToNextStage = async () => {
    if (currentStage === STAGES[1]) {
      const valid = await validatePartially([
        'title',
        'category',
        'expense_date',
        'amount',
        'currency',
      ])
      if (!valid) return
      setCurrentStage(STAGES[2])
    }
  }

  const onSubmit = (formData: TExpenseHookForm) => {
    analyticsTrackEvent(AnalyticsEvents.Expenses.apply_expense, {})
    const receitptClaimAmt = files.reduce(
      (acc, file) => parseInt(file.amount.toString()) + acc,
      0,
    )

    if (
      receitptClaimAmt >
      (isNumber(formData.amount) ? formData.amount : parseInt(formData.amount))
    ) {
      setError('amount', {
        type: 'manual',
        message: `Total receipt claim amount(s) cannot exceed expense amount of ${formData.amount}`,
      })
      return
    }

    if (!formData.currency) {
      setError('currency', {
        type: 'manual',
        message: 'Currency is required',
      })
      return
    }

    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${
      formData.recipient_number
    }`

    const filesToUpload: Omit<FileData, 'amount'>[] = []
    const receiptAmount: number[] = []

    files.forEach(a => {
      filesToUpload.push(_.omit(a, ['amount']))
      receiptAmount.push(parseInt(a.amount))
    })

    const payload: ExpensePayload = {
      ...formData,
      expense_type: 'EMPLOYEE',
      status: isPaid ? Statuses.PAID : Statuses.NOTPAID,
      is_imprest: isImprest ? 1 : 0,
      client_id: employeeID,
      company_id: companyID || '',
      bank_id: formData?.bank_id || null,
      branch_id: formData?.branch_id || null,
      payment_method: payMethod === 'MOBILE_MONEY' ? mMoneyProvider : payMethod,
      mobile:
        payMethod === 'MOBILE_MONEY'
          ? mobileNumber || formData?.recipient_number
          : '',
      currency_id: formData.currency,
      currency: formData.currency,
      country_id: empCountryId,
      acc_no: formData?.acc_no || '',
      expense_date: dateToString(formData?.expense_date, 'yyyy-MM-dd'),
      payment_date: !_.isNil(formData?.payment_date)
        ? dateToString(formData?.payment_date, 'yyyy-MM-dd')
        : '',
      till_no: formData?.till_no || '',
      paybill_no: formData?.paybill_no || '',
      type: formData?.category || '',
      action: 'create',
      tax_id: 4,
      recorded_from: 'HRM',
      attachments: filesToUpload,
      previous_receipts: JSON.stringify(prevReceipts),
      amounts: receiptAmount,
      description: formData?.description || '',
    }

    // omit description if empty
    if (!payload.description) {
      delete payload.description
    }

    if (expenseDetail) {
      const editPayLoad: Partial<EditExpensePayload> = { ...payload }
      const id = expenseDetail?.id
      editPayLoad['action'] = 'update'
      editPayLoad['id'] = id
      editPayLoad['dr'] = `${category}`
      editPayLoad['claimAmount'] = formData.amount
      delete editPayLoad['category']
      editExpensesMutation.mutate(
        { id, payload: editPayLoad },
        {
          onSuccess: () => {
            setFiles([])
            setSuccessModal(true)
          },
        },
      )
    } else {
      createExpenseMutation.mutate(payload, {
        onSuccess: () => {
          setFiles([])
          setSuccessModal(true)
          analyticsTrackEvent(
            AnalyticsEvents.Expenses.apply_expense_success,
            {},
          )
        },
        onError: () => {
          setSuccessModal(false)
          analyticsTrackEvent(
            AnalyticsEvents.Expenses.apply_expense_failure,
            {},
          )
        },
      })
    }
  }

  const editClaimAmountHandler = (index: any, fileType: fileTypes) => {
    setCurrentFileType(fileType ?? fileTypes.ATTACHMENT)
    if (expenseDetail) {
      if (fileType === fileTypes.RECEIPT) {
        const newReceipts = [...prevReceipts]
        setIsEditing(true)
        setPrevReceiptIndex(index)
        if (index === -1) return
        if (!newReceipts[index]) return
        const receipt = newReceipts[index]

        setUploadingNewFile(true)
        setEditClaimAmount(receipt.amount)
        // setCurrentFileIndex(files.length)
      } else {
        if (!files[index]) return
        setCurrentFileIndex(index)
        setEditClaimAmount(files[index].amount)
      }

      setTimeout(() => {
        setFilesModal(true)
      }, 1000)
    } else {
      if (!files[index]) return
      setCurrentFileIndex(index)
      setEditClaimAmount(files[index].amount)
      setFilesModal(true)
    }
  }

  const MoMoPaymentOptions = () => {
    switch (mMoneyProvider) {
      case 'PAYBILL':
        return (
          <>
            <Box width="100%" mt={'24px'}>
              <CommonInput
                name="paybill_no"
                control={control}
                label="Paybill Number"
                isRequired
                rules={{ required: 'Paybill number is required' }}
                isDisabled={createExpenseMutation?.isLoading}
                placeholder="Enter paybill number"
              />
              <Box mt={'24px'}></Box>
              <CommonInput
                name="acc_no"
                control={control}
                label="Account number"
                isRequired
                rules={{
                  required: 'Please enter an account number',
                  minLength: {
                    value: 1,
                    message: 'Acc. No. cannot have less than 1 character',
                  },
                }}
                isDisabled={createExpenseMutation?.isLoading}
                error={errors.acc_no}
                placeholder="Enter account number"
              />
            </Box>
          </>
        )

      case 'TILL':
        return (
          <Box mt={'24px'}>
            <CommonInput
              name="till_no"
              control={control}
              label="Till Number"
              isRequired
              rules={{
                required: 'Please add the till number',
                minLength: {
                  value: 5,
                  message: 'Till No. cannot be less than 5 digits',
                },
                pattern: {
                  value: /^[0-9]*$/,
                  message: 'The input value is invalid',
                },
              }}
              isDisabled={createExpenseMutation?.isLoading}
              error={errors.till_no}
              placeholder="Enter till number"
            />
          </Box>
        )
    }
  }

  const hasFiles = files.length > 0 || prevReceipts.length > 0

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <Box mt={'18px'}></Box>

        {!isImprest ? (
          <Box mt="12px" mb={'24px'}>
            <DocumentBoxButton
              label={
                hasFiles
                  ? 'View/Edit your Receipts'
                  : 'Attach Receipts to Expense'
              }
              onPress={() => {
                setUploadingNewFile(false)
                if (hasFiles) {
                  setFileListModal(true)
                } else {
                  setFilesModal(true)
                  analyticsTrackEvent(
                    AnalyticsEvents.Expenses.open_expenses_file_modal,
                    {},
                  )
                }
              }}
              numberOfFiles={files.length + prevReceipts.length}
            />
          </Box>
        ) : null}

        {currentStage === STAGES[1] ? (
          <Box>
            <CommonInput
              name="title"
              control={control}
              label="Expense Name"
              my="12px"
              rules={{
                required: { value: true, message: 'Name is required' },
                maxLength: {
                  value: 75,
                  message: 'Name cannot be more than 75 characters',
                },
                // reject empty spaces at the beginning or end of the name reject emojis
                pattern: {
                  value: /^[^\s].+[^\s]$/,
                  message: 'Name cannot start or end with empty spaces',
                },
              }}
            />

            {/* categpory v2 */}
            <Box mt={'10px'}></Box>
            <DateInput
              control={control}
              name="expense_date"
              rules={{
                required: { value: true, message: 'Expense Date is required' },
              }}
              label="Expense Date"
            />

            <Box mt={'18px'}></Box>

            <CommonInputCurrency
              label={'Amount'}
              placeholder={'Enter amount'}
              keyboardType="numeric"
              name={'amount'}
              control={control}
              rules={{
                required: 'Please enter an amount',
                pattern: {
                  value: /^[0-9]\d*$/,
                  message: 'The amount must be a number',
                },
              }}
              inputProps={{}}
              currencies={currencyOptions}
              currencyItem={currency}
              currencyData={empCurrencyCode ? empCurrencyData : null}
              disableCurrency={false}
              setValue={setValue}
              setShowCountryPicker={setShowCountryPicker}
              showCountryPicker={showCountryPicker}
            />

            <Box mt={'18px'}></Box>

            <ActionSheetPickerSubOptions
              control={control}
              name="category"
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              rules={{ required: 'Please select a category' }}
              setValue={value => setValue('category', value)}
              searchable
            />

            <Box my="12px">
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize={'16px'} color={'grey'}>
                  Expense has been paid
                </Text>
                <Switch
                  isChecked={isPaid}
                  onToggle={() => setIsPaid(!isPaid)}
                />
              </HStack>
            </Box>
            {isPaid ? (
              <Box my="12px">
                <DateInput
                  control={control}
                  name="payment_date"
                  rules={{
                    required: {
                      value: true,
                      message: 'Payment Date is required',
                    },
                  }}
                  label="Date of payment"
                />
              </Box>
            ) : null}

            <Box my="12px">
              <TextAreaInput
                name="description"
                control={control}
                label="Notes"
                rules={{
                  required: 'Please enter a description',
                  minLength: {
                    value: 5,
                    message: 'Description cannot be less than 5 characters',
                  },
                }}
              />
            </Box>

            <Box h={'40px'}></Box>
          </Box>
        ) : null}

        {/* currency dropdown v2 */}

        {currentStage == STAGES[2] ? (
          <Box>
            <Box mt="24px" />

            {/* PAYMENT method action picker */}
            <ActionSheetPicker
              control={control}
              name="payment_method"
              label="Payment Method"
              placeholder="Select a payment method"
              options={paymentOptions}
              rules={{ required: 'Please select a payment method' }}
              setValue={value => setValue('payment_method', value)}
              searchable
            />

            {payMethod === 'BANK' ? (
              <>
                <Box mt="24px" />

                <ActionSheetPicker
                  control={control}
                  name="bank_id"
                  label="Bank"
                  placeholder="Select a bank"
                  options={memoizedBankOptions}
                  rules={{ required: 'Please select a bank' }}
                  setValue={value => setValue('bank_id', value)}
                  searchable
                />

                <Box mt="24px" />

                <ActionSheetPicker
                  control={control}
                  name="branch_id"
                  label="Bank Branch"
                  placeholder="Select a branch"
                  options={selectedBank?.branches || []}
                  rules={{ required: 'Please select a branch' }}
                  setValue={value => setValue('branch_id', value)}
                  searchable
                />

                <CommonInput
                  name="acc_no"
                  control={control}
                  label="Bank Account"
                  rules={{
                    required: 'Please enter an account number',
                    minLength: {
                      value: 9,
                      message: 'Acc. No. cannot be less than 9 digits',
                    },
                    pattern: {
                      value: /^[0-9]\d*$/,
                      message: 'The input value is invalid',
                    },
                  }}
                  mt="24px"
                />
              </>
            ) : // </Box>
            null}
            <Box mt="20px" />

            {payMethod === 'MOBILE_MONEY' ? (
              <DropdownInputV2
                label="Mobile Money Provider"
                control={control}
                name="mMoneyProvider"
                items={mobilePaymentOptions}
                setValue={value => setValue('mMoneyProvider', value)}
                zIndex={1003}
                rules={{
                  required: {
                    value: true,
                    message: 'Mobile Money Provider is required',
                  },
                }}
                disabled={createExpenseMutation.isLoading || !currency}
              />
            ) : null}

            {MoMoPaymentOptions()}

            {payMethod === 'MOBILE_MONEY' ? (
              <Box mt="24px" mb={'12px'}>
                <Text
                  fontFamily={'body'}
                  fontSize={'14px'}
                  mb={'5px'}
                  color={'grey'}>
                  {mMoneyProvider === 'MPESA'
                    ? 'Mobile mpesa number'
                    : 'Mobile notification number'}
                </Text>
                <Box>
                  <PhoneField
                    control={control}
                    name="recipient_number"
                    error={isDirty ? errors.recipient_number : undefined}
                    ref={phoneRef}
                    defaultCode={
                      selectedCountryCode || countryPhoneinputCode || 'KE'
                    }
                    placeholder="Phone #"
                    containerStyle={{
                      width: '100%',
                      borderRadius: 4,
                    }}
                    disabled={false}
                    rules={
                      mMoneyProvider === 'MPESA'
                        ? {
                            required: 'Mobile number is required',
                          }
                        : {}
                    }
                  />
                </Box>
              </Box>
            ) : null}

            {/* validate partially errors */}

            {errors?.['currency']?.message ? (
              <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                {errors['currency']?.message as ReactNode}
              </Text>
            ) : null}
            {errors['amount']?.message ? (
              <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                {errors['amount']?.message as ReactNode}
              </Text>
            ) : null}
            {errors['description']?.message ? (
              <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                {errors['description']?.message as ReactNode}
              </Text>
            ) : null}

            <Box mt="12px"></Box>
          </Box>
        ) : null}
      </ScrollView>

      <SubmitButton
        onPress={
          currentStage === STAGES[1]
            ? continueToNextStage
            : handleSubmit(onSubmit)
        }
        title={
          currentStage == STAGES[1]
            ? 'Continue'
            : expenseDetail
            ? 'Save'
            : 'Record Expense'
        }
        disabled={createExpenseMutation.isLoading}
      />

      <DocumentPickerModal
        onUserCanceled={() => setDocModal(false)}
        isVisible={docModal}
        hideModal={() => setDocModal(false)}
        onBackdropPress={() => setDocModal(false)}
        showCamera
        allowFiles
        setFile={noop}
        setFileItem={file => handleFileUpload(file)}
        setPhotoURI={noop}
        setPhotoItem={photo => handleSetPhoto(photo)}
      />
      <BottomModalFilesExpense
        title={isEditing ? 'Edit Receipt' : 'Upload Receipt'}
        message=""
        btnLabel="Back to module"
        onPressBtn={() => {
          setFilesModal(false)
          setUploadingNewFile(false)
          navigation.goBack()
        }}
        onPressUploadFile={() => {
          // setFilesModal(false)

          setFilesModal(false)
          setTimeout(() => {
            setDocModal(true)
          }, 1000)
        }}
        files={files}
        currentFileIndex={currentFileIndex}
        prevReceiptIndex={prevReceiptIndex}
        setPrevReceiptIndex={setPrevReceiptIndex}
        setFiles={setFiles}
        isOpen={filesModal}
        onHide={() => setFilesModal(false)}
        control={control}
        editAmount={editClaimAmount}
        isEdit={expenseDetail ? true : false}
        prevReceipts={prevReceipts}
        setPrevReceipts={setPrevReceipts}
        closeIcon={true}
        empCurrencyCode={empCurrencyCode}
        currencyData={empCurrencyData}
        uploadingNewFile={uploadingNewFile}
        currentFileType={currentFileType}
        setCurrentFileIndex={setCurrentFileIndex}
      />

      <BottomModalFilesList
        title="Attached Receipts"
        message=""
        btnLabel="Back to module"
        files={files}
        currentFileIndex={currentFileIndex}
        control={control}
        setFiles={setFiles}
        onPressBtn={() => {
          setFileListModal(false)
          setUploadingNewFile(true)
          setEditClaimAmount(null)
          setCurrentFileIndex(null)
          setPrevReceiptIndex(null)
          setIsEditing(false)
          setTimeout(() => {
            setFilesModal(true)
          }, 1000)
          // navigation.goBack()
        }}
        editAmount={editClaimAmount}
        editClaimAmountHandler={editClaimAmountHandler}
        closeIcon={true}
        isEdit={expenseDetail ? true : false}
        prevReceipts={prevReceipts}
        setPrevReceipts={setPrevReceipts}
        isOpen={fileListModal}
        onHide={() => setFileListModal(false)}
        receipts={prevReceipts}
        handleEditClaimAmount={editClaimAmountHandler}
        hasEdit
        currencyCode={currencyCode}
      />

      <SuccessModal
        title={`Expense ${expenseDetail ? 'Updated' : 'created'} successfully`}
        message=""
        btnLabel={'Back to module'}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.navigate(ExpenseRoutes.All)
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal
        message="Submitting expense claim"
        isVisible={
          createExpenseMutation.isLoading || editExpensesMutation.isLoading
        }
      />
    </Box>
  )
}

export default ExpenseForm
