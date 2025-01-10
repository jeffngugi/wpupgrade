import React, { useEffect, useState } from 'react'
import { Box, HStack, ScrollView, Switch, Text } from 'native-base'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
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
import { debounce, isEmpty, isNull, noop } from 'lodash'
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
import { TLeaveItem } from '../types'
import { FileScrollView } from '~components/FilesScrollView'

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
  const accountSetting = queryClient.getQueryData(settingQKeys.account)
  const { remoteEnabled } = useRemotePayrollEnabled()
  const showLeaveTime = accountSetting?.data?.show_leave_time

  const leaveReturnInputType: 'DAYS_AND_HOURS' | 'RETURN_DATE' =
    accountSetting?.data?.leave_return_input_type

  const { control, handleSubmit, setValue, watch } = useForm()
  const [isHalfDay, setIsHalfDay] = useState(false)
  const [open, setOpen] = useState(false)
  const [category, SetCatgory] = useState('')
  const [selectedLeaveItem, setSelectedLeaveItem] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [leaveItems, setLeaveItems] = useState<optionsType[]>([])
  const [relieverPicker, setRelieverPicker] = useState(false)
  const [reliever, SetReliever] = useState('')
  const [noOfDoc, setNoOfDoc] = useState(0)
  const [relieverOptions, setRelieverOptions] = useState<optionsType[]>([])
  const [docModal, setDocModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<any>([])
  const fdata = new FormData()
  const [categoryBalance, setCategoryBalance] = useState(null)
  const [balanceLabel, setBalanceLabel] = useState('')

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
  const isLoading = leaveBalances.isLoading

  const balanceData = leaveBalances
  const { mutate, isLoading: submiting } = useCreateLeave()
  const { mutate: mutateEdit, isLoading: submitingEdit } = useEditLeave()

  const handleFilterReliever = (text: any) => {
    debouncedSearch(text)
  }

  const debouncedSearch = React.useRef(
    debounce(text => {
      setSearchText(text)
    }, 200),
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
    SetReliever(item.reliever_id ?? '')

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
    setLeaveItems(leavePolicies)
    if (isEdit) {
      initialiseForm()
    }
  }, [item, balanceData?.data?.data, isEdit])

  useEffect(() => {
    if (!isEmpty(leaveItems)) {
      const selected = leaveItems.filter(
        leaveItem => leaveItem.value === category,
      )
      setNoOfDoc(selected[0]?.no_of_documents ?? 0)
    }
  }, [category])

  useEffect(() => {
    if (isEdit && item?.leave_type_id) {
      SetCatgory(item?.leave_type_id)
    }
  }, [leaveItems])

  const onSubmit = data => {
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
      fdata.append('half_day_option', data.dayoption)
    }
    if (noOfDoc > 0 && filesToUpload.length > 0) {
      filesToUpload.forEach(doc => {
        fdata.append('files[]', doc)
      })
    }
    if (isEdit) {
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

  useEffect(() => {
    if (category) {
      const result = leaveItems.find(leave => {
        return leave.value === category
      })
      //format available balance to 2 decimal places
      setCategoryBalance(result?.available_balance)
      setSelectedLeaveItem(result)
      setBalanceLabel(
        `You have ${result?.available_balance?.toFixed(2) ?? ''} ${
          result?.leave_name
        } balance(s)`,
      )
    }
  }, [category])

  const hours = watch('hours')

  return (
    <Box flex={1} backgroundColor="white">
      <KeyBoardScrollView>
        <Box flex={1}>
          <ScrollView>
            <Text mt="32px" mb={'5px'}>
              {t('leave_policy')}
            </Text>
            <DropDownPicker
              loading={isLoading}
              control={control}
              value={category}
              open={open}
              options={leaveItems}
              setOptions={setLeaveItems}
              setValue={SetCatgory}
              setOpen={setOpen}
              rules={{
                required: { value: true, message: t('policy_required') },
              }}
              name="leave_type_id"
            />
            {categoryBalance ? (
              <Text mt="3px" color="green.50" fontSize="12px">
                {balanceLabel}
              </Text>
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
                        {`Apply your leave ${selectedLeaveItem?.apply_leave_before_days} days before the start date`}
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
                  name="dayoption"
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
            <Text mb="5px" mt="12px">
              {t('reliever')}
            </Text>
            <DropDownPicker
              searchable
              onSearchText={handleFilterReliever}
              control={control}
              value={reliever}
              open={relieverPicker}
              options={relieverOptions}
              setOptions={setRelieverOptions}
              setValue={SetReliever}
              setOpen={setRelieverPicker}
              rules={{}}
              name="reliever"
              loading={relieaverLoading}
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
                    label="Add document"
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
        title={
          isEdit ? 'Leave Saved Successfully' : t('successful_application')
        }
        message=""
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
