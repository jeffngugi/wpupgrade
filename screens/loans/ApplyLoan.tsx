import React, { useCallback, useEffect, useState } from 'react'
import { Box, Checkbox, HStack, Pressable, ScrollView, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import DateInput from '~components/date/DateInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import LoanCalcItem from './components/LoanCalcItem'
import LoanCalc from './components/LoanCalc'
import { LoanRoutes } from '~types'
import LoanIcon from '~assets/svg/loan-icon.svg'
import PercentIcon from '~assets/svg/percent.svg'
import { useGetWPLoanCategories, useLoanCategoriesFetchQuery } from '~api/loans'
import { createSelectOptions } from '~helpers'
import _, { isEmpty, isUndefined, noop } from 'lodash'
import SubmitButton from '~components/buttons/SubmitButton'
import LoanFileBtn from './components/LoanFileBtn'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import { Alert, Linking, Platform } from 'react-native'
import { toNumber } from 'lodash'
import DocumentPlaceHolder from '~screens/document/components/DocumentPlaceHolder'
import { useMyProfile } from '~api/account'
import { isFeatureEnabled, useMenuItems } from '~utils/hooks/useMenuItems'
import { urls } from '~utils/appConstants'

const ApplyLoan = ({ navigation }) => {
  const [termsAccepted, setTermAccepted] = useState(false)
  const [docModal, setDocModal] = useState(false)
  const [financeModal, setFinanceModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedLoanCategory, setSeledctedLoanCategory] = useState('')
  const [items, setItems] = useState<optionsType[]>([])
  const [documentName, setDocumentName] = useState('')
  const [photoItem, setPhotoItem] = useState<any>()
  const [financialItem, setFinancialItem] = useState<any>()
  const [financialItemName, setFinancialItemName] = useState('')
  const { enabledFeatures } = useMenuItems()

  const loanCategoriesFetch = useLoanCategoriesFetchQuery({
    searchText: '',
  })

  const { data: profileData } = useMyProfile()
  const currencyId = profileData?.data?.currency_id
  const wpLoanCategories = useGetWPLoanCategories({ currency_id: currencyId })

  const isWorkpayFunded = isFeatureEnabled(
    'workpay_funded_employee_loans',
    enabledFeatures,
  )

  const loanCategoriesOptions = createSelectOptions(
    loanCategoriesFetch?.data?.data?.data?.data,
  )

  const wpLoanOptions = createSelectOptions(
    wpLoanCategories?.data?.data,
    'loan_category_id',
    'category_name',
  )

  const { handleSubmit, control, setValue, watch } = useForm()

  const rate = watch('rate')
  const type = watch('type')
  const amount = watch('principal')
  const duration = watch('no_of_months')

  useEffect(() => {
    if (selectedLoanCategory && !isWorkpayFunded) {
      const loanCategorySelected = loanCategoriesOptions.find(
        data => data?.value === selectedLoanCategory,
      )
      setValue('type', loanCategorySelected?.data?.type)
      setValue('rate', Number(loanCategorySelected?.data?.monthly_rate))
    } else {
      const wpLoanSelected = wpLoanOptions.find(
        data => data?.value === selectedLoanCategory,
      )
      setValue('type', wpLoanSelected?.data?.type)
      setValue('rate', Number(wpLoanSelected?.data?.interest_rate))
    }
  }, [selectedLoanCategory])

  const onPressTerms = useCallback(
    () => Linking.openURL(urls.loansTermsConditions),
    [],
  )

  const handleFileUpload = (file: any, residence: boolean) => {
    if (!file) return
    if (residence) {
      const fileData = {
        name: file.name,
        type: file.type,
        uri: file.uri,
      }
      setDocumentName(file.name)
      setPhotoItem(fileData)
    } else {
      const fileData = {
        name: file.name,
        type: file.type,
        uri: file.uri,
      }
      setFinancialItemName(file.name)
      setFinancialItem(fileData)
    }
  }

  const handleSetPhoto = (photo: any, residence: boolean) => {
    if (!photo) return
    if (residence) {
      const photoData = {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      }
      setDocumentName(photo.fileName)
      setPhotoItem(photoData)
    } else {
      const photoData = {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      }
      setFinancialItemName(photo.fileName)
      setFinancialItem(photoData)
    }
  }

  const requestFile = toNumber(amount) > 100000 && toNumber(duration) > 3

  const reviewLoan = formdata => {
    if (isWorkpayFunded) {
      if (requestFile && (!photoItem || !financialItem)) {
        Alert.alert('Please attach a all documents')
        return
      }
    }

    const reviewDetails = {
      principal: formdata.principal,
      rate: formdata.rate,
      type: formdata.type,
      noOfMonths: formdata.no_of_months,
      startDate: formdata.start_date,
      reason: formdata.reason,
      selectedLoanCategory,
      ...(!isUndefined(financialItem) && {
        financial_statement: financialItem,
      }),
      ...(!isUndefined(photoItem) && {
        proof_of_residence: photoItem,
      }),
    }
    // analyticsTrackEvent(AnalyticsEvents.Loans.apply_loan, reviewDetails)
    // analyticsTrackEvent(AnalyticsEvents.Loans.review_loan, reviewDetails)
    navigation.navigate(LoanRoutes.Review, { reviewDetails })
  }

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="Apply for loan"
        onPress={() => navigation.goBack()}
        close
      />

      <ScrollView>
        <Box mt={'24px'}></Box>

        <Text mt={'10px'} mb={'5px'}>
          Category
        </Text>
        <DropDownPicker
          control={control}
          value={selectedLoanCategory}
          open={open}
          options={isWorkpayFunded ? wpLoanOptions : loanCategoriesOptions}
          setOptions={setItems}
          setValue={setSeledctedLoanCategory}
          setOpen={setOpen}
          loading={loanCategoriesFetch.isLoading}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
          // zIndex={2000}
          name="category"
          searchable={true}
        />

        {selectedLoanCategory && (
          <Box marginTop="8px">
            <LoanCalc>
              <LoanCalcItem
                label="Loan type"
                value={type || '--'}
                Icon={LoanIcon}
                NoSpace
              />
              <LoanCalcItem
                label="Interest rate"
                value={rate}
                Icon={PercentIcon}
                NoSpace
              />
            </LoanCalc>
          </Box>
        )}

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
          <TextAreaInput name="reason" control={control} label="Reason" />
        </Box>
        {isWorkpayFunded ? (
          <>
            {requestFile ? (
              <>
                <Box my="10px" />
                {!isEmpty(financialItemName) ? (
                  <DocumentPlaceHolder name={financialItemName} />
                ) : (
                  <LoanFileBtn
                    onPress={() => setFinanceModal(true)}
                    label="Mpesa statement( Up to 1 year)"
                  />
                )}

                <Box my="10px" />
                {!isEmpty(documentName) ? (
                  <DocumentPlaceHolder name={documentName} />
                ) : (
                  <LoanFileBtn
                    onPress={() => setDocModal(true)}
                    label="Proof of address"
                  />
                )}
              </>
            ) : null}
            <Box my="10px" />
            <HStack space={6}>
              <Checkbox
                onChange={isSelected => setTermAccepted(isSelected)}
                shadow={2}
                value="terms"
                colorScheme="green">
                <Text>Accept loan</Text>
                <Pressable onPress={onPressTerms}>
                  <Text color="green.50">Terms and conditions</Text>
                </Pressable>
              </Checkbox>
            </HStack>
          </>
        ) : null}
      </ScrollView>
      <Box my="10px" />
      <SubmitButton
        disabled={isWorkpayFunded && !termsAccepted}
        title="Next"
        onPress={handleSubmit(reviewLoan)}
      />

      <DocumentPickerModal
        onUserCanceled={() => setDocModal(false)}
        isVisible={docModal}
        hideModal={() => setDocModal(false)}
        onBackdropPress={() => setDocModal(false)}
        showCamera
        allowFiles
        setFile={noop}
        setFileItem={file => handleFileUpload(file, true)}
        setPhotoURI={noop}
        setPhotoItem={photo => handleSetPhoto(photo, true)}
      />
      <DocumentPickerModal
        onUserCanceled={() => setFinanceModal(false)}
        isVisible={financeModal}
        hideModal={() => setFinanceModal(false)}
        onBackdropPress={() => setFinanceModal(false)}
        showCamera
        allowFiles
        setFile={noop}
        setFileItem={file => handleFileUpload(file, false)}
        setPhotoURI={noop}
        setPhotoItem={photo => handleSetPhoto(photo, false)}
      />
    </Box>
  )
}

export default ApplyLoan
