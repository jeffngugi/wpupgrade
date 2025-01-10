import _, { isNumber, noop, omit, toString } from 'lodash'
import { Box, HStack, ScrollView, Switch, Text, VStack } from 'native-base'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import DocumentButton from '~components/buttons/DocumentBtn'
import DateInput from '~components/date/DateInput'
import { optionsType } from '~components/DropDownPicker'
import CommonInput from '~components/inputs/CommonInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import PhoneField from '~components/inputs/PhoneField'
import BottomModalFiles from '~components/modals/BottomModalFiles'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import LoadingModal from '~components/modals/LoadingModal'
import SuccessModal from '~components/modals/SuccessModal'
import { State } from '~declarations'
import {
  createCurrencySelectOptionsTyped,
  createExpenseSelectOptions,
  createExpenseSelectOptionsTyped,
  getBankOptions,
} from '~helpers'
import { dateToString } from '~utils/date'
import { useNavigation } from '@react-navigation/native'
import { parseISO } from '~utils/date'
import { usePaypoints } from '~api/payouts/bulk'
import { FileScrollView } from '../../../components/FilesScrollView'
import SubmitButton from '~components/buttons/SubmitButton'
import {
  Bank,
  EditExpensePayload,
  ExpensePayload,
  TExpenseHookForm,
  TExpenseItem,
} from '../types'
import {
  ExpenseRoutes,
  FileData,
  MainStackUseNavigationProp,
  SupportDocData,
} from '~types'
import { useFetchProfile } from '~api/home'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import {
  getEmployeeMobilePaymentOptions,
  getEmployeePaymentOptions,
} from '../helpers'

const Statuses = {
  NOTPAID: 'NOTPAID',
  PAID: 'PAID',
}

const ExpenseForm = ({ item: expenseDetail }: { item?: TExpenseItem }) => {
  const navigation = useNavigation<MainStackUseNavigationProp>()

  const { data: profileInfo } = useFetchProfile()
  const country = profileInfo?.data?.country_code ?? ''
  const countryPhoneinputCode = country.slice(0, 2)

  const [docModal, setDocModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [isImprest, setIsImprest] = useState(false)
  const [category, setCategory] = useState('')
  const [categoryOptions, setCategoryOptions] = useState<optionsType[]>([])

  const [files, setFiles] = useState<FileData[]>([])
  const [supportingDocuments, setSupportingDocuments] = useState<
    SupportDocData[]
  >([])
  const [selectedFileType, setSelectedFileType] = useState<string>('receipt')
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0)
  const [filesModal, setFilesModal] = useState(false)

  const [prevReceipts, setPrevReceipts] = useState<any[]>([])
  const [prevSupportingDocs, setPrevSupportingDocs] = useState<any[]>([])
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
    setValue,
  } = useForm<TExpenseHookForm>()

  const {
    user: { employee_id: employeeID, company_id: companyID, token },
  } = useSelector((state: State) => state.user)

  const expenseCategoriesFetch = useExpenseCategoriesFetchQuery({
    searchText: '',
  })

  const expenseCategoriesOptions = createExpenseSelectOptions(
    expenseCategoriesFetch?.data?.data?.data?.data ?? [],
    'id',
    'name',
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

  const currency = watch('currency')
  const currencyCode = currencyOptions.find(
    option => option.value === currency,
  )?.code
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

  const empCurrencyCode = employeeDetails?.data?.data?.data?.currency_code || ''
  const empCountryId = employeeDetails?.data?.data?.data?.country_id || ''

  const banksQuery = usePaypoints({})
  const banks: Bank[] = banksQuery?.data?.data?.data || []

  const memoizedBankOptions = useMemo(() => getBankOptions(banks), [banks])

  const payMethod = watch('payment_method')
  const mMoneyProvider = watch('mMoneyProvider')
  const bankId = watch('bank_id')
  const selectedBank = memoizedBankOptions.find(bank => bank.value === bankId)

  /**
   * This function will be run if we are on editing mode
   */
  const initializeEditing = () => {
    if (!expenseDetail) return

    const amount = expenseDetail.amount ? parseInt(expenseDetail.amount) : 0
    setIsImprest(expenseDetail.is_imprest)
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
    setValue('bank_id', expenseDetail?.bank_id)
    setValue('payment_method', expenseDetail?.payment_method)
    setValue('recipient_number', toString(nationalNumber))
    setValue('description', expenseDetail?.description ?? '')

    if (expenseDetail?.status === Statuses.PAID) {
      setIsPaid(true)
      setValue('payment_date', parseISO(expenseDetail?.payment_date))
    }
    setValue('bank_id', expenseDetail?.bank_id)
    setValue('branch_id', toString(expenseDetail?.branch_id))
    setValue('acc_no', expenseDetail?.acc_no)
    if (expenseDetail?.has_supporting_documents) {
      setPrevSupportingDocs(expenseDetail?.with_valid_supporting_documents)
    }
    if (expenseDetail?.with_valid_receipts) {
    } else {
      setPrevReceipts(expenseDetail?.with_valid_receipts)
    }


    const prevAmt = prevReceipts?.reduce((acc, claim) => {
      const sum = acc + Number(claim.amount)
      return sum
    }, 0)
  }

  useEffect(() => {
    setCategoryOptions(expenseCategoriesOptions)
  }, [])

  useEffect(() => {
    if (expenseDetail) {
      initializeEditing()
    }
  }, [expenseDetail])

  useEffect(() => {
    if (expenseDetail?.payment_method) {
      //does payment mehod exist in the payment options
      const paymentMethodExist = paymentOptions.some(
        option => option.value === expenseDetail.payment_method,
      )
      //if not check if it is a mobile money provider
      if (!paymentMethodExist) {
        const mobileMoneyProviderExist = mobilePaymentOptions.some(
          option => option.value === expenseDetail.payment_method,
        )

        if (mobileMoneyProviderExist) {
          setValue('mMoneyProvider', expenseDetail.payment_method)
          setValue('payment_method', 'MOBILE_MONEY')
        }
      } else {
        setValue('payment_method', expenseDetail.payment_method)
      }
    }
  }, [expenseDetail, paymentOptions, mobilePaymentOptions])

  const handleFileUpload = (file: FileData) => {
    if (!file) return
    const fileData: FileData = {
      name: file.name,
      type: file.type,
      category: 'doc',
      uri: file.uri,
      amount: '',
    }

    if (selectedFileType === 'receipt') {
      setCurrentFileIndex(files.length)
      const updatedFiles: FileData[] = [...files, fileData]
      setFiles(updatedFiles)
      setTimeout(() => {
        setFilesModal(true)
        analyticsTrackEvent(
          AnalyticsEvents.Expenses.select_expenses_modal_gallery,
          { name: file.name },
        )
      }, 1000)
    } else if (selectedFileType === 'supporting') {
      const updatedFiles = [...supportingDocuments, omit(fileData, 'amount')]
      setSupportingDocuments(updatedFiles)
    }
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
    if (selectedFileType === 'receipt') {
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
    } else if (selectedFileType === 'supporting') {
      const updatedFiles = [...supportingDocuments, omit(photoData, 'amount')]
      setSupportingDocuments(updatedFiles)
      return
    }

    analyticsTrackEvent(AnalyticsEvents.Expenses.select_expenses_modal_camera, {
      name: photo.fileName,
    })
  }

  const createExpenseMutation = useExpensesCreateMutation()
  const editExpensesMutation = useExpensesEditMutation()

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
        message: 'Total receipt claim amount(s) cannot exceed this amount',
      })
      return
    }

    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${formData.recipient_number
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
      recipient_number: mobileNumber || formData?.recipient_number,
      currency_id: formData?.currency ?? empCurrencyCode,
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
      supporting_documents: supportingDocuments,
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
      // console.log('sdsdlskdsd', omit(payload, ['mMoneyProvider']))
      createExpenseMutation.mutate(omit(payload, ['mMoneyProvider']), {
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

  const editClaimAmountHandler = (index: any) => {
    if (expenseDetail) {
      if (index < prevReceipts.length) {
        const claimAmount = prevReceipts[index].amount
        setEditClaimAmount(claimAmount)
        setFilesModal(true)
        setCurrentFileIndex(index)
      }
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

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <Box mt={'18px'}></Box>

        {!expenseDetail ? (
          <Box my="12px">
            <HStack alignItems="center" justifyContent="space-between">
              <VStack width={'83%'}>
                <Text fontSize={'16px'} color={'charcoal'}>
                  Make this an imprest expense
                </Text>
                <Text fontSize={'14px'} color={'grey'}>
                  Funds advanced to an employee for immediate expenses, with
                  subsequent reimbursement
                </Text>
              </VStack>
              <Switch
                isChecked={isImprest}
                onToggle={() => setIsImprest(!isImprest)}
              />
            </HStack>
          </Box>
        ) : (
          <Box mt={'12px'}></Box>
        )}

        <CommonInput
          name="title"
          control={control}
          label="Title"
          my="12px"
          rules={{
            required: { value: true, message: 'Title is required' },
          }}
        />

        {/* categpory v2 */}
        <DropdownInputV2
          label="Category"
          control={control}
          name="category"
          items={categoryOptions}
          setValue={value => setValue('category', value)}
          zIndex={1007}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
          searchable={true}
          categorySelectable={false}
        />

        <Box mt={'24px'} mb={'12px'}>
          <HStack justifyContent="space-between">
            <DateInput
              control={control}
              name="expense_date"
              rules={{
                required: { value: true, message: 'Expense Date is required' },
              }}
              label="Expense Date"
              width="48%"
            />

            <CommonInput
              name="amount"
              control={control}
              label="Amount"
              keyboardType="number-pad"
              rules={{
                required: 'Please enter an amount',
                min: {
                  value: 1,
                  message: 'Value cannot be less than 1',
                },
                pattern: {
                  value: /^[0-9]\d*$/,
                  message: 'The input value is invalid',
                },
              }}
              width="48%"
            />
          </HStack>
        </Box>
        <Box my="12px">
          <HStack alignItems="center" justifyContent="space-between">
            <Text fontSize={'16px'} color={'grey'}>
              Paid expense
            </Text>
            <Switch isChecked={isPaid} onToggle={() => setIsPaid(!isPaid)} />
          </HStack>
        </Box>
        {isPaid ? (
          <Box my="12px">
            <DateInput
              control={control}
              name="payment_date"
              rules={{
                required: { value: true, message: 'Payment Date is required' },
              }}
              label="Date of payment"
            />
          </Box>
        ) : null}

        {/* currency dropdown v2 */}
        <DropdownInputV2
          label="Currency"
          control={control}
          name="currency"
          items={currencyOptions}
          setValue={value => setValue('currency', value)}
          // setValue={handleSetValue}
          zIndex={1006}
          rules={{
            required: { value: true, message: 'Currency is required' },
          }}
          searchable={true}
        />

        <Box mt="24px" />

        <DropdownInputV2
          label={'Payment Method'}
          control={control}
          name={'payment_method'}
          items={paymentOptions}
          setValue={value => setValue('payment_method', value)}
          // searchable
          zIndex={1005}
          rules={{
            required: { value: true, message: 'Method is required' },
          }}
          disabled={createExpenseMutation.isLoading || !currency}
          loading={paymentMethods.isLoading}
        />

        {payMethod === 'BANK' ? (
          <>
            <Box mt="24px" />
            <DropdownInputV2
              label="Bank"
              control={control}
              name="bank_id"
              items={memoizedBankOptions}
              setValue={value => setValue('bank_id', value)}
              zIndex={1004}
              rules={{
                required: { value: true, message: 'Branch is required' },
              }}
              disabled={createExpenseMutation.isLoading || !currency}
            />

            <Box mt="24px" />

            <DropdownInputV2
              label="Bank Branch"
              control={control}
              name="branch_id"
              items={selectedBank?.branches || []}
              setValue={value => setValue('branch_id', value)}
              zIndex={1003}
              rules={{
                required: {
                  value: selectedBank?.branches?.length,
                  message: 'Branch is required',
                },
              }}
              disabled={createExpenseMutation.isLoading || !currency}
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
        <Box mt="24px" />

        {payMethod === 'MOBILE_MONEY' ? (
          <DropdownInputV2
            label="Mobile Money Provider"
            control={control}
            name="mMoneyProvider"
            items={mobilePaymentOptions}
            setValue={value => setValue('mMoneyProvider', value)}
            zIndex={1003}
            rules={{
              required: { value: true, message: 'Category is required' },
            }}
            disabled={createExpenseMutation.isLoading || !currency}
            loading={paymentMethods.isLoading}
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
                defaultCode={countryPhoneinputCode ?? 'KE'}
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

        {!isImprest ? (
          <Box mt="12px" mb={'12px'}>
            <DocumentButton
              label="Add receipt"
              onPress={() => {
                setDocModal(true)
                setSelectedFileType('receipt')
                analyticsTrackEvent(
                  AnalyticsEvents.Expenses.open_expenses_file_modal,
                  {},
                )
              }}
            />
            <Box mt="18px" />
          </Box>
        ) : null}
        {!isImprest ? (
          <Box mt="8px">

            <FileScrollView
              files={files}
              receipts={prevReceipts}
              setFiles={setFiles}
              setPrevReceipts={setPrevReceipts}
              handleEditClaimAmount={editClaimAmountHandler}
              hasEdit
            />
          </Box >
        ) : null}

        <Box mt="20px" mb={'12px'}>
          <DocumentButton
            label="Add supporting document"
            onPress={() => {
              setDocModal(true)
              setSelectedFileType('supporting')
              analyticsTrackEvent(
                AnalyticsEvents.Expenses.open_expenses_file_modal,
                {},
              )
            }}
          />
        </Box>
        <Box mt="8px">
          <FileScrollView
            files={supportingDocuments}
            receipts={prevSupportingDocs}
            setFiles={setSupportingDocuments}
            setPrevReceipts={setPrevSupportingDocs}
            handleEditClaimAmount={editClaimAmountHandler}
            hasDelete={false}
            hasEdit={false}
          />
        </Box>

        <Box mt="12px" mb={'24px'} />
      </ScrollView >

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title={expenseDetail ? 'Save ' : 'Record'}
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
      <BottomModalFiles
        title="Add Receipt"
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
        isEdit={expenseDetail ? true : false}
        prevReceipts={prevReceipts}
        setPrevReceipts={setPrevReceipts}
        closeIcon={true}
      />
      <SuccessModal
        title={`Expenses ${expenseDetail ? 'Updated' : 'created'} successfully`}
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
    </Box >
  )
}

export default ExpenseForm
