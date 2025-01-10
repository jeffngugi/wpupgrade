import { Box, Button, HStack, ScrollView, Switch, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import RadioBtn from '~components/inputs/RadioBtn'
import TextAreaInput from '~components/inputs/TextAreaInput'
import { queryClient } from '~ClientApp'
import { settingQKeys } from '~api/QueryKeys'
import {
  TRelieverFilter,
  useEditLeave,
  useGetRelievers,
  useLeaveBalances,
} from '~api/leave'
import { createPickerItems } from '~utils/createPickerItems'
import { debounce, isEmpty, noop } from 'lodash'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { State } from '~declarations'
import { formatDate, formatFromWPDate } from '~utils/date'
import CommonInput from '~components/inputs/CommonInput'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import SuccessModal from '~components/modals/SuccessModal'
import LoadingModal from '~components/modals/LoadingModal'
import { TLeaveItem } from '../types'
import { useNavigation } from '@react-navigation/native'
import KeyBoardScrollView from '~components/KeyBoardScrollView'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SubmitButton from '~components/buttons/SubmitButton'

const EditLeave = ({ item }: { item: TLeaveItem }) => {
  const navigation = useNavigation()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const { t } = useTranslation('leaves')
  const accountSetting = queryClient.getQueryData(settingQKeys.account)
  const leaveReturnInputType: 'DAYS_AND_HOURS' | 'RETURN_DATE' =
    accountSetting?.data?.leave_return_input_type

  useStatusBarBackgroundColor('white')

  const { control, handleSubmit, setValue } = useForm()
  const [isHalfDay, setIsHalfDay] = useState(!!item.is_half_day)
  const [open, setOpen] = useState(false)
  const [category, SetCatgory] = useState(item.leave_type_id ?? '')
  const [leaveItems, setLeaveItems] = useState<optionsType[]>([])
  const [relieverPicker, setRelieverPicker] = useState(false)
  const [noOfDoc, setNoOfDoc] = useState(0)
  const [relieverOptions, setRelieverOptions] = useState<optionsType[]>([])
  const [docModal, setDocModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [searchText, setSearchText] = useState(
    item?.reliever_name ? item?.reliever_name : '',
  )
  const [reliever, SetReliever] = useState(item.reliever_id ?? '')
  const fdata = new FormData()
  const relieverFilter: TRelieverFilter = {
    searchText: searchText,
    status: 'ACTIVE',
  }
  const { data: relieverData, isLoading: relieaverLoading } =
    useGetRelievers(relieverFilter)
  const { data: balanceData, isLoading } = useLeaveBalances()
  const { mutate, isLoading: submiting } = useEditLeave()

  const handleFilterReliever = (text: string) => {
    debouncedSearch(text)
  }

  //
  const debouncedSearch = React.useRef(
    debounce(text => {
      setSearchText(text)
    }, 200),
  ).current
  const intialiseForm = () => {
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
      setValue('half_day_option', item.half_day_option)
    }
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
    const leavePolicies = createPickerItems(
      balanceData?.data?.data[0]?.employeeleaves,
      'leave_type_id',
      'leave_name',
    )
    setLeaveItems(leavePolicies)
    intialiseForm()
  }, [])

  useEffect(() => {
    if (!isEmpty(leaveItems)) {
      const selected = leaveItems.filter(
        leaveItem => leaveItem.value === category,
      )
      setNoOfDoc(selected[0]?.no_of_documents ?? 0)
    }
  }, [category])

  const onSubmit = data => {
    const toDate =
      leaveReturnInputType === 'RETURN_DATE' && !isHalfDay
        ? formatDate(data.return_date, 'backend')
        : '0'
    const leaveDays =
      leaveReturnInputType === 'DAYS_AND_HOURS' && data.days ? data.days : '0'
    const leaveHours =
      leaveReturnInputType === 'DAYS_AND_HOURS' && data.hours ? data.hours : '0'

    const fromDate = formatDate(data.start_date, 'backend')
    fdata.append('leave_type_id', data.leave_type_id)
    fdata.append('requestId', item.id)
    fdata.append('from', fromDate)
    fdata.append('reason', data.reason)
    fdata.append('employee_id', employee_id as string)
    fdata.append('auth_employee_id', employee_id as string)
    fdata.append('reliever_id', data.reliever ?? '')
    fdata.append('is_half_day', isHalfDay ? '1' : '0')
    fdata.append('to', toDate)
    fdata.append('days', leaveDays)
    fdata.append('hours', leaveHours)
    fdata.append('action', 'update')
    if (isHalfDay) {
      fdata.append('half_day_option', data.dayoption)
    }
    const payload = {
      id: item.id,
      fdata,
    }

    mutate(payload, {
      onSuccess: () => setSuccessModal(true),
    })
  }

  return (
    <Box flex={1}>
      <KeyBoardScrollView>
        <Box mt="24px" />
        <Text mb="5px">{t('leave_policy')}</Text>
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
        {leaveReturnInputType === 'RETURN_DATE' ? (
          <HStack alignItems="center" justifyContent="space-between" my="10px">
            <Text>{t('half_day')}</Text>
            <Switch
              isChecked={isHalfDay}
              onToggle={() => setIsHalfDay(!isHalfDay)}
            />
          </HStack>
        ) : null}

        <HStack alignItems="center" justifyContent="space-between" mb="15px">
          <Box
            width={
              isHalfDay || leaveReturnInputType !== 'RETURN_DATE'
                ? '100%'
                : '48%'
            }
            mt="10px">
            <DateInput
              control={control}
              name="start_date"
              label={t('start_date')}
              rules={{
                required: {
                  value: true,
                  message: t('start_date_required'),
                },
              }}
            />
          </Box>
          {!isHalfDay && leaveReturnInputType === 'RETURN_DATE' ? (
            <Box width="48%" mt="10px">
              <DateInput
                control={control}
                label={t('return_date')}
                name="return_date"
                rules={{
                  required: {
                    value: true,
                    message: t('return_date_required'),
                  },
                }}
              />
            </Box>
          ) : null}
        </HStack>
        {isHalfDay ? (
          <RadioBtn
            control={control}
            name="dayoption"
            label=""
            defaultValue={item.half_day_option}
            leftLabel={t('morning')}
            rightLabel={t('afternoon')}
            rules={{
              required: {
                value: isHalfDay,
                message: 'Please select daytime',
              },
            }}
          />
        ) : null}
        {leaveReturnInputType === 'DAYS_AND_HOURS' ? (
          <HStack alignItems="center" justifyContent="space-between">
            <Box width={'48%'}>
              <CommonInput
                control={control}
                name="days"
                label={t('days')}
                rules={{
                  required: {
                    value: true,
                    message: t('days_required'),
                  },
                }}
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
                }}
              />
            </Box>
          </HStack>
        ) : null}
        <Text mb="5px" mt="10px">
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
        <Box my="5px" />
        <TextAreaInput label={t('notes')} name="reason" control={control} />
      </KeyBoardScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        title={t('save')}
        loading={submiting}
      />

      <DocumentPickerModal
        onUserCanceled={() => setDocModal(false)}
        isVisible={docModal}
        hideModal={() => setDocModal(false)}
        onBackdropPress={() => setDocModal(false)}
        allowFiles
        setFile={noop}
        setFileItem={noop}
        setPhotoURI={noop}
        setPhotoItem={noop}
      />
      <SuccessModal
        title={t('successful_update')}
        message=""
        btnLabel={t('review_edit')}
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.goBack()
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal message={t('editing_leave')} isVisible={submiting} />
    </Box>
  )
}

export default EditLeave
