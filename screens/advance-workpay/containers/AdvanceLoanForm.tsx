import React, { useEffect, useState } from 'react'
import { Box, HStack, ScrollView, Text, Toast } from 'native-base'
import { optionsType } from '~components/DropDownPicker'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import DateInput from '~components/date/DateInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import LoanCalcItem from '../components/LoanCalcItem'
import LoanCalc from '../components/LoanCalc'
import { AdvanceLoanRoutes, FileData } from '~types'
import PercentIcon from '~assets/svg/percent.svg'
import _, { noop } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import { Platform } from 'react-native'
import DocumentButton from '~components/buttons/DocumentBtn'
import {
  useGetAdvanceLoanLimit,
  useSalaryAdvanceLoanSettings,
} from '~api/advance-loans'
import { FileScrollView } from '~components/FilesScrollView'
import { parseISO } from '~utils/date'
import ErrorAlert from '~components/ErrorAlert'
import moment from 'moment'

interface AdvanceLoanFormProps {
  navigation: any
  item?: any
}

interface AdvanceLoanFormData {
  principal: string
  no_of_months: string
  start_date: string
  reason: string
}

const AdvanceLoanForm = ({ navigation, item }: AdvanceLoanFormProps) => {
  const [selectedLoanCategory, setSeledctedLoanCategory] = useState('')
  const [docModal, setDocModal] = useState(false)

  const workpayAdvanceLimit = useGetAdvanceLoanLimit()
  const workpayAdvanceLimitData = workpayAdvanceLimit?.data?.data
  const employeeLoanLimit =
    workpayAdvanceLimitData?.salary_advance_employee_limit ?? 0

  const [proofOfResidenceFiles, setProofOfResidenceFiles] = useState<
    FileData[]
  >([])
  const [financialStatementFiles, setFinancialStatementFiles] = useState<
    FileData[]
  >([])
  const [currentFileTypeSelection, setCurrentFileTypeSelection] = useState<
    string | null
  >(null)
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null)
  const [showFileInput, setShowFileInput] = useState(false)

  const salaryAdvanceParams = {
    type: 'salary_advance',
  }
  const useCompanySalaryAdvance =
    useSalaryAdvanceLoanSettings(salaryAdvanceParams)
  const salaryAdvanceLoanSettings =
    useCompanySalaryAdvance?.data?.data?.settings?.data?.[0]
  const interestRate = salaryAdvanceLoanSettings?.interest

  const { handleSubmit, control, setValue, watch } = useForm()
  const amount = watch('principal')
  const no_of_months = watch('no_of_months')

  useEffect(() => {
    if (item) {
      setValue('principal', parseInt(item?.principal)?.toString(), {
        shouldValidate: false,
      })
      setValue('no_of_months', item?.duration?.toString())
      setValue('start_date', parseISO(item?.start_date))
      setValue('reason', item?.reason)
    }
  }, [item])

  useEffect(() => {
    if (parseInt(amount) >= 100000 && parseInt(no_of_months) > 3) {
      setShowFileInput(true)
    } else {
      setShowFileInput(false)
    }
  }, [amount, no_of_months])

  const handleFileUpload = (file: any) => {
    if (!file) return
    const fileData: FileData = {
      name: file.name,
      type: file.type,
      category: 'doc',
      uri: file.uri,
      amount: '',
    }
    const files =
      currentFileTypeSelection === 'proof_of_residence'
        ? proofOfResidenceFiles
        : financialStatementFiles
    const updatedFiles = [fileData]
    setCurrentFileIndex(files.length)
    if (currentFileTypeSelection === 'proof_of_residence') {
      setProofOfResidenceFiles(updatedFiles)
    }
    if (currentFileTypeSelection === 'financial_statement') {
      setFinancialStatementFiles(updatedFiles)
    }

    analyticsTrackEvent(
      AnalyticsEvents.Expenses.select_expenses_modal_gallery,
      { name: file.name },
    )
  }

  const handleSetPhoto = (photo: any) => {
    if (!photo) return
    const photoData = {
      name: photo.fileName,
      type: photo.type,
      category: 'photo',
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      amount: '',
    }
    const files =
      currentFileTypeSelection === 'proof_of_residence'
        ? proofOfResidenceFiles
        : financialStatementFiles
    setCurrentFileIndex(files.length)
    const updatedFiles = [photoData]
    if (currentFileTypeSelection === 'proof_of_residence') {
      setProofOfResidenceFiles(updatedFiles)
    }
    if (currentFileTypeSelection === 'financial_statement') {
      setFinancialStatementFiles(updatedFiles)
    }

    setTimeout(() => {
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

  const reviewLoan = (formdata: AdvanceLoanFormData) => {
    const isEdit = !!item
    const itemId = item?.id ?? null
    const reviewDetails = {
      principal: formdata.principal,
      rate: interestRate,
      noOfMonths: formdata.no_of_months,
      startDate: moment(formdata.start_date).format('YYYY-MM-DD'),
      reason: formdata.reason,
      selectedLoanCategory,
      proofOfResidenceFiles,
      financialStatementFiles,
      isEdit,
      itemId,
    }

    if (
      parseInt(formdata?.principal) >= 100000 &&
      parseInt(formdata?.no_of_months) > 3
    ) {
      if (
        proofOfResidenceFiles.length < 1 ||
        financialStatementFiles.length < 1
      ) {
        Toast.show({
          render: () => {
            return (
              <ErrorAlert
                description={
                  'Please upload proof of residence and financial statement'
                }
              />
            )
          },
          placement: 'top',
          top: 100,
          duration: 3000,
        })
        return
      }
    } else {
      //omit the files if the amount is less than 100000 and months is less than 4
      reviewDetails.proofOfResidenceFiles = []
      reviewDetails.financialStatementFiles = []
    }

    analyticsTrackEvent(
      AnalyticsEvents.AdvanceLoans.apply_for_advance,
      reviewDetails,
    )
    analyticsTrackEvent(
      AnalyticsEvents.AdvanceLoans.review_advance_loan,
      reviewDetails,
    )

    navigation.navigate(AdvanceLoanRoutes.Review, { reviewDetails })
  }
  console.log('employeeLoanLimit', employeeLoanLimit)
  return (
    <Box flex={1} backgroundColor="white">
      <ScrollView>
        <Box marginTop="8px">
          <LoanCalc>
            <LoanCalcItem
              label="Interest rate"
              value={interestRate}
              Icon={PercentIcon}
              NoSpace
            />
          </LoanCalc>
        </Box>

        <CommonInput
          control={control}
          label="Amount"
          name="principal"
          rules={{
            required: { value: true, message: 'Amount is required' },
            validate: {
              numericValue: value =>
                /^[0-9]*$/.test(value) || 'Please enter a numeric value',
            },
            max: {
              value: parseFloat(employeeLoanLimit),
              message: `Amount should not exceed ${employeeLoanLimit}`,
            },
          }}
          my="10px"
          keyboardType="numeric"
        />

        <Box my="10px">
          <HStack justifyContent="space-between">
            <CommonInput
              control={control}
              label="Number of months"
              name="no_of_months"
              keyboardType="numeric"
              rules={{
                required: {
                  value: true,
                  message: 'Number of months is required',
                },
                validate: {
                  numericValue: value =>
                    /^[0-9]*$/.test(value) || 'Please enter a numeric value',
                },
              }}
              width="48%"
            />
            <DateInput
              control={control}
              name="start_date"
              label="Start date"
              rules={{
                required: {
                  value: true,
                  message: 'Start Date is required',
                },
              }}
              width="48%"
            />
          </HStack>
        </Box>
        <Box my="10px">
          <TextAreaInput
            name="reason"
            control={control}
            label="Reason"
            required={true}
            rules={{
              required: {
                value: true,
                message: 'Reason is required',
              },
            }}
          />
        </Box>
        {showFileInput && (
          <>
            <Box mt="12px" mb={'4px'}>
              <DocumentButton
                label="Add proof of residence"
                onPress={() => {
                  setDocModal(true)
                  setCurrentFileTypeSelection('proof_of_residence')
                  analyticsTrackEvent(
                    AnalyticsEvents.AdvanceLoans.open_upload_document_modal,
                    {},
                  )
                }}
              />
            </Box>
            <Box mt="4px">
              <FileScrollView
                files={proofOfResidenceFiles}
                receipts={[]}
                setFiles={setProofOfResidenceFiles}
                // setPrevReceipts={setPrevReceipts}
              />
            </Box>
            <Box mt="24px" mb={'4px'}>
              <DocumentButton
                label="Add financial statement"
                onPress={() => {
                  setDocModal(true)
                  setCurrentFileTypeSelection('financial_statement')
                  analyticsTrackEvent(
                    AnalyticsEvents.AdvanceLoans.open_upload_document_modal,
                    {},
                  )
                }}
              />
            </Box>
            <Box mt="4px">
              <FileScrollView
                files={financialStatementFiles}
                receipts={[]}
                setFiles={setFinancialStatementFiles}
                // setPrevReceipts={setPrevReceipts}
              />
            </Box>
          </>
        )}
        <Box my="10px" />
      </ScrollView>

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

      <SubmitButton title="Next" onPress={handleSubmit(reviewLoan)} />
    </Box>
  )
}

export default AdvanceLoanForm
