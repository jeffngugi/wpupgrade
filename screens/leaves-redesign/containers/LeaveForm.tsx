import React, { useEffect, useState } from 'react'
import { Box, HStack, ScrollView, Spinner, Switch, Text } from 'native-base'
import { optionsType } from '~components/DropDownPicker'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import RadioBtn from '~components/inputs/RadioBtn'
import TextAreaInput from '~components/inputs/TextAreaInput'
import CommonInput from '~components/inputs/CommonInput'
import { queryClient } from '~ClientApp'
import { settingQKeys } from '~api/QueryKeys'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import {
  TRelieverFilter,
  useCreateLeave,
  useEditLeave,
  useGetRelievers,
  useLeaveBalances,
} from '~api/leave'
import { debounce, isEmpty, isNull, noop, round } from 'lodash'
import { createPickerItems } from '~utils/createPickerItems'
import { useTranslation } from 'react-i18next'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import DocumentButton from '~components/buttons/DocumentBtn'
import { Platform, StatusBar } from 'react-native'
import { formatDate, formatFromWPDate } from '~utils/date'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import SubmitButton from '~components/buttons/SubmitButton'
import KeyBoardScrollView from '~components/KeyBoardScrollView'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import useRemotePayrollEnabled from '~utils/hooks/remote-payroll-enabled'
import {
  AccountSetting,
  LeaveOptionsType,
  OnSubmitLeaveData,
  TLeaveItem,
} from '../types'
import { FileScrollView } from '~components/FilesScrollView'
import ActionSheetPicker from '~components/inputs/ActionSheetPicker'
import InfoBlueIcon from '~assets/svg/info-solid.svg'
import InfoIcon from '~assets/svg/info-solid-green.svg'
import LeaveCalc from '~screens/leaves-redesign/component/LeaveCalc'
import LeaveCalcItem from '~screens/leaves-redesign/component/LeaveCalcItem'
import LeaveCalcItemSub from '~screens/leaves-redesign/component/LeaveCalcItemSub'

const LeaveForm = ({
  navigation,
  item,
  isEdit = false,
}: {
  navigation: any
  item?: TLeaveItem
  isEdit?: boolean
}) => {
  const {
    user: { employee_id, company_id },
  } = useSelector((state: State) => state.user)
  const { t } = useTranslation('leaves')
  const accountSetting = queryClient.getQueryData<AccountSetting>(
    settingQKeys.account,
  )
  const { remoteEnabled } = useRemotePayrollEnabled()
  let showLeaveTime = accountSetting?.data?.show_leave_time
  showLeaveTime = false

  const leaveReturnInputType = accountSetting?.data?.leave_return_input_type

  const { control, handleSubmit, setValue, watch } = useForm<OnSubmitLeaveData>()
  const [isHalfDay, setIsHalfDay] = useState(false)
  const [selectedLeaveItem, setSelectedLeaveItem] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [leaveItems, setLeaveItems] = useState<LeaveOptionsType[]>([])
  const [reliever, SetReliever] = useState('')
  const [noOfDoc, setNoOfDoc] = useState(0)
  const [relieverOptions, setRelieverOptions] = useState<optionsType[]>([])
  const [docModal, setDocModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<any>([])
  const fdata = new FormData()
  const [categoryBalance, setCategoryBalance] = useState<null | number>(null)

  const [fileReceipts, setFileReceipts] = useState<any[]>([])
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor('white')
  }, [])

  const relieverFilter: TRelieverFilter = {
    searchText,
    status: 'ACTIVE',
  }
  const { data: relieverData, isLoading: relieaverLoading } =
    useGetRelievers(relieverFilter)

  const leaveBalances = useLeaveBalances({
    employeeId: employee_id,
  })

  const balanceData = leaveBalances
  const { mutate, isLoading: submiting } = useCreateLeave()
  const { mutate: mutateEdit, isLoading: submitingEdit } = useEditLeave()

  const startDate = watch('start_date')
  const returnDate = watch('return_date')

  const fromDate = startDate ? formatDate(startDate, 'backend') : ''

  const toDate = returnDate ? formatDate(returnDate, 'backend') : ''
  const halfDayOption = watch('day_option')

  const detailsToDate = !isHalfDay ? toDate : halfDayOption

  const leave_type_id = watch('leave_type_id')

  const leaveRequestEnabled = !!leave_type_id && !!fromDate && !!detailsToDate

  const leaveDetailsFilters = {
    employee_id: employee_id,
    leave_type_id: leave_type_id,
    is_half_day: isHalfDay ? 1 : 0,
    half_day_option: halfDayOption,
    from: fromDate,
    to: detailsToDate,
  }

  const leaveDetails =
    ({
      filters: leaveDetailsFilters,
      leaveRequestEnabled,
    })

  const leaveDetailSummary = leaveDetails?.data?.data?.summary

  const handleFilterReliever = (text: any) => {
    debouncedSearch(text)
  }

  const debouncedSearch = React.useRef(
    debounce(text => {
      setSearchText(text)
    }, 1000),
  ).current

  const initialiseForm = () => {
    if (!item) return
    setValue('leave_type_id', item.leave_type_id)
    setValue('start_date', formatFromWPDate(item.from))
    setValue('return_date', formatFromWPDate(item.to))
    setValue('reason', item.reason)
    setValue('reliever_id', item.reliever_id)
    setValue('to', item.to)
    setValue('days', item.days)
    setValue('hours', item.hours)
    SetReliever(item.reliever_id?.toString() ?? '')
    if (item.is_half_day) {
      setValue('day_option', item.half_day_option)
      setIsHalfDay(true)
    } else {
      setValue('day_option', '')
      setIsHalfDay(false)
    }
    const receipts: { attachment: string }[] | [] =
      item?.document_link?.map(file => {
        return {
          attachment: file,
        }
      }) ?? []
    setFileReceipts(receipts)
  }

  useEffect(() => {
    const relievers = createPickerItems(
      relieverData?.data?.data,
      'id',
      'employee_name',
    )
    setRelieverOptions(relievers)
  }, [relieverData?.data?.data])

  useEffect(() => {
    const leavePolicies = remoteEnabled
      ? createPickerItems(
        balanceData?.data?.data,
        'leave_type_id',
        'leave_name',
      )
      : createPickerItems(
        balanceData?.data?.data?.[0]?.employeeleaves,
        'leave_type_id',
        'leave_name',
      )
    const orderedLeavePolicies = leavePolicies.sort((a, b) =>
      a.leave_name.localeCompare(b.leave_name),
    )
    setLeaveItems(orderedLeavePolicies)
    if (isEdit) {
      initialiseForm()
    }
  }, [item, balanceData?.data?.data, isEdit])

  //set leave balance and no of documents
  useEffect(() => {
    if (!isEmpty(leaveItems)) {
      const result = leaveItems.find(leave => {
        return leave.value === leave_type_id
      })
      setNoOfDoc(result?.no_of_documents ?? 0)
      setCategoryBalance(result?.balance_days ? result?.balance_days : null)
      setSelectedLeaveItem(result)
    }
  }, [leave_type_id])

  useEffect(() => {
    if (isEdit && item?.leave_type_id) {
      setValue('leave_type_id', item?.leave_type_id)
    }
  }, [leaveItems])

  const onSubmit = (data: OnSubmitLeaveData) => {
    const trackEvent = isEdit
      ? AnalyticsEvents.Leaves.edit_leave
      : AnalyticsEvents.Leaves.apply_leave
    analyticsTrackEvent(trackEvent, {})
    const toDate = isHalfDay ? '' : formatDate(data.return_date, 'backend')
    const leaveDays = data.days ? data.days : '0'
    const leaveHours = data.hours ? data.hours : '0'

    const fromDate = formatDate(data.start_date, 'backend')
    fdata.append('leave_type_id', data.leave_type_id)
    fdata.append('from', fromDate)
    fdata.append('reason', data.reason)
    fdata.append('employee_id', employee_id as string)
    fdata.append('auth_employee_id', employee_id as string)
    fdata.append('authorize_for', 'employee')
    fdata.append('auth_company_id', company_id as string)
    fdata.append('reliever_id', data.reliever ?? '')
    fdata.append('is_half_day', isHalfDay ? '1' : '0')
    fdata.append('to', toDate)
    fdata.append('days', leaveDays)
    fdata.append('hours', leaveHours)
    if (isHalfDay) {
      fdata.append('half_day_option', data.day_option)
    }

    if (noOfDoc > 0 && filesToUpload.length > 0) {
      filesToUpload.forEach(doc => {
        fdata.append('files[]', doc)
      })
    }
    if (isEdit && item) {
      fdata.append('action', 'update')

      const payload = {
        id: item.id,
        fdata,
      }

      mutateEdit(payload, {
        onSuccess: () => {
          setSuccessModal(true)
          analyticsTrackEvent(AnalyticsEvents.Leaves.edit_leave_success, {})
          setFilesToUpload([])
        },
      })
    } else {
      mutate(fdata, {
        onSuccess: () => {
          setSuccessModal(true)
          setFilesToUpload([])
          analyticsTrackEvent(AnalyticsEvents.Leaves.apply_leave_success, {})
        },
      })
    }
  }

  const handleFileUpload = (file: any) => {
    if (!file) return
    const fileData = {
      name: file.name,
      type: file.type,
      uri: file.uri,
    }
    analyticsTrackEvent(AnalyticsEvents.Leaves.select_leave_file, {
      name: file.name,
    })
    setFilesToUpload([...filesToUpload, fileData])
  }

  const handleSetPhoto = (photo: any) => {
    if (!photo) return
    const photoData = {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    }
    analyticsTrackEvent(AnalyticsEvents.Leaves.select_leave_file, {
      name: photo.fileName,
    })
    setFilesToUpload([...filesToUpload, photoData])
  }

  const hours = watch('hours')

  return (
    <Box flex={1} backgroundColor="white">
      <KeyBoardScrollView>
        <Box flex={1}>
          <ScrollView>
            <Text mt="32px" mb={'5px'}>
              {t('leave_policy')}
            </Text>

            <ActionSheetPicker
              control={control}
              name="leave_type_id"
              placeholder="Select leave policy"
              options={leaveItems}
              rules={{ required: 'Please select a leave policy' }}
              setValue={value => setValue('leave_type_id', value)}
              searchable
            />
            {categoryBalance ? (
              <>
                <LeaveCalc>
                  <LeaveCalcItem
                    label={t('leave_balance_text', {
                      leave_name: selectedLeaveItem?.leave_name,
                    })}
                    value={round(categoryBalance, 2)?.toString()}
                    Icon={InfoBlueIcon}
                    NoSpace
                  />
                  <LeaveCalcItemSub
                    label={t('leave_days_taken_text')}
                    value={`${selectedLeaveItem?.days_taken} days`}
                    NoSpace
                  />
                </LeaveCalc>
              </>
            ) : null}

            {remoteEnabled ||
              (leaveReturnInputType === 'RETURN_DATE' && !showLeaveTime) ? (
              <HStack
                alignItems="center"
                justifyContent="space-between"
                mt="32px">
                <Text color={'charcoal'} fontSize={'16px'}>
                  {t('half_day')}
                </Text>
                <Switch
                  isChecked={isHalfDay}
                  onToggle={() => setIsHalfDay(!isHalfDay)}
                />
              </HStack>
            ) : null}

            <Box justifyContent="space-between" my="12px" flexDirection={'row'}>
              <Box width={showLeaveTime && !remoteEnabled ? '48%' : '100%'}>
                <DateInput
                  control={control}
                  label="Start Date"
                  name="start_date"
                  rules={{
                    required: {
                      value: true,
                      message: t('start_date_required'),
                    },
                  }}
                />
                {selectedLeaveItem
                  ? !isNull(selectedLeaveItem?.apply_leave_before_days) && (
                    <Text>
                      {t('apply_leave_before_text', {
                        days: selectedLeaveItem?.apply_leave_before_days,
                      })}
                    </Text>
                  )
                  : null}
              </Box>
              {showLeaveTime && !remoteEnabled ? (
                <Box width={'48%'}>
                  <DateInput
                    control={control}
                    label="Start Time"
                    name="start_time"
                    mode="time"
                    rules={{
                      required: {
                        value: true,
                        message: t('start_time_required'),
                      },
                    }}
                  />
                </Box>
              ) : null}
            </Box>

            {leaveReturnInputType === 'RETURN_DATE' && !isHalfDay ? (
              <Box
                justifyContent="space-between"
                my="12px"
                flexDirection={'row'}>
                <Box width={showLeaveTime && !remoteEnabled ? '48%' : '100%'}>
                  <DateInput
                    control={control}
                    label="Return Date"
                    name="return_date"
                    minimumDate={startDate}
                    rules={{
                      required: {
                        value: true,
                        message: t('return_date_required'),
                      },
                    }}
                  />
                </Box>
                {showLeaveTime && !remoteEnabled ? (
                  <Box width={'48%'}>
                    <DateInput
                      control={control}
                      label="Return Time"
                      name="return_time"
                      mode="time"
                      rules={{
                        required: {
                          value: true,
                          message: t('return_time_required'),
                        },
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            ) : null}

            {isHalfDay ? (
              <Box my={'12px'}>
                <RadioBtn
                  control={control}
                  name="day_option"
                  label=""
                  leftLabel={t('morning')}
                  rightLabel={t('afternoon')}
                  rules={{
                    required: {
                      value: isHalfDay,
                      message: 'Please select daytime',
                    },
                  }}
                />
              </Box>
            ) : null}
            {leaveReturnInputType === 'DAYS_AND_HOURS' && !isHalfDay ? (
              <HStack my={'12px'} width={'100%'} justifyContent="space-between">
                <Box width={'48%'}>
                  <CommonInput
                    control={control}
                    name="days"
                    label={t('days')}
                    rules={{
                      required: {
                        value: !hours,
                        message: t('days_required'),
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: 'Only numeric values are allowed',
                      },
                    }}
                    keyboardType="numeric"
                  />
                </Box>
                <Box width="48%">
                  <CommonInput
                    control={control}
                    name="hours"
                    label={t('hours')}
                    rules={{
                      required: {
                        value: false,
                        message: t('hours_required'),
                      },
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: 'Only numeric values are allowed',
                      },
                    }}
                  />

                </Box>
              </HStack>
            ) : null}

            {leaveDetails.isLoading && leaveRequestEnabled ? (
              <HStack mt="10px" alignItems="center" justifyContent={'center'}>
                <Spinner color="green.500" size={'sm'} marginRight="15px" />
                <Text fontFamily={'body'} fontSize={'16px'}>
                  {t('leave_duration_loading')}
                </Text>
              </HStack>
            ) : leaveDetailSummary ? (
              <LeaveCalc bgColor="green.10" borderColor={'green.50'}>
                <LeaveCalcItem
                  label={t('leave_duration_text', { leaveDetailSummary })}
                  value={''}
                  Icon={InfoIcon}
                  NoSpace
                />
              </LeaveCalc>
            ) : null}

            <Text mb="5px" mt="12px">
              {t('reliever')}
            </Text>
            <ActionSheetPicker
              control={control}
              name="reliever"
              options={relieverOptions}
              rules={{}}
              setValue={value => setValue('reliever', value)}
              searchable
              onSearchText={handleFilterReliever}
              loading={relieaverLoading}
              searchText={searchText}
            />

            <Box mt="24px" />

            <TextAreaInput name="reason" control={control} label="Notes" />
            {filesToUpload.length > 0 || fileReceipts.length > 0 ? (
              <Box my="10px">
                <FileScrollView
                  files={filesToUpload}
                  setFiles={setFilesToUpload}
                  hasDelete
                  receipts={fileReceipts}
                  setPrevReceipts={setFileReceipts}
                />
              </Box>
            ) : null}
            {noOfDoc > 0 &&
              ((isEdit
                ? fileReceipts.length + filesToUpload.length
                : filesToUpload.length) < noOfDoc ? (
                <Box my="10px">
                  <Text mb="10px">
                    {t('attach') + noOfDoc + t('documents')}{' '}
                  </Text>
                  <DocumentButton
                    label={t('document_add_btn')}
                    onPress={() => {
                      setDocModal(true)
                      analyticsTrackEvent(
                        AnalyticsEvents.Leaves.open_leaves_file_modal,
                        {},
                      )
                    }}
                  />
                </Box>
              ) : null)}
            {/* <Box mt={'10px'}>
              <Text mb="10px">{t('attach') + noOfDoc + t('documents')} </Text>
            </Box> */}
            <Box mb={'20px'} />
          </ScrollView>
        </Box>
      </KeyBoardScrollView>
      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title={isEdit ? t('save') : t('apply')}
        disabled={
          (isEdit
            ? fileReceipts.length + filesToUpload.length
            : filesToUpload.length) < noOfDoc
        }
      />
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
      <SuccessModal
        title={isEdit ? t('successful_update') : t('successful_application')}
        message={t('leave_success_application_description')}
        btnLabel={t('review')}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.goBack()
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal
        message={isEdit ? t('submiting_leave') : t('submiting_leave')}
        isVisible={submiting || submitingEdit}
      />
    </Box>
  )
}

export default LeaveForm
