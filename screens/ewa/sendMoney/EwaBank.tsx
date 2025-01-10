import React, { useEffect, useState } from 'react'
import { Text } from 'native-base'
import CommonInput from '../../../components/inputs/CommonInput'
import { EwaFormProps } from '../EwaSendMoney'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import { useTranslation } from 'react-i18next'
import { useMyProfile } from '~api/account'
import { useGetBanks } from '~api/ewa'
import { createPickerItems } from '~utils/createPickerItems'
import KeyBoardScrollView from '~components/KeyBoardScrollView'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { TEwaFavourite } from '~types'

interface Props extends EwaFormProps {
  setValue: UseFormSetValue<FieldValues>
  item: TEwaFavourite | undefined
}

const EwaBank = ({ control, item, setValue }: Props) => {
  const [open, setOpen] = useState(false)
  const [bank, setBank] = useState('')
  const [bankOptions, setBankOptions] = useState<optionsType[]>([])
  const { t } = useTranslation('ewa')
  const { data } = useMyProfile()
  const country_id = data.data.address.country_id ?? ''

  const params = {
    country_id,
    recordsPerPage: 500,
  }
  const { data: bankData } = useGetBanks(params)

  useEffect(() => {
    const relievers = createPickerItems(bankData?.data?.data, 'id', 'name')
    setBankOptions(relievers)
  }, [bankData?.data?.data])

  useEffect(() => {
    if (item) {
      setValue('accName', item?.name)
      setValue('acc_no', item?.account_number)
      setBank(item?.bank_id as unknown as string)
      setValue('bank_id', item?.bank_id as unknown as string)
    }
  }, [item])

  return (
    <KeyBoardScrollView>
      <Text mt={'10px'} mb={'5px'} color={'grey'} fontSize={'14px'}>
        {t('bank')}
      </Text>
      <DropDownPicker
        searchable
        control={control}
        value={bank}
        open={open}
        options={bankOptions}
        setOptions={setBankOptions}
        setValue={setBank}
        setOpen={setOpen}
        rules={{
          required: { value: true, message: t('bankRequired') },
        }}
        name="bank_id"
      />
      <CommonInput
        label={t('account')}
        name="acc_no"
        control={control}
        keyboardType="phone-pad"
        rules={{
          required: { value: true, message: t('accountRequired') },
          maxLength: { value: 16, message: t('checkAccountNumber') },
          pattern: {
            value: /^[0-9]+$/,
            message: t('invalidAccount'),
          },
        }}
        marginTop="24px"
      />
      <CommonInput
        label={t('accountName')}
        name="accName"
        control={control}
        rules={{
          required: { value: true, message: t('accountRequired') },
        }}
        marginTop="24px"
      />
      <CommonInput
        label={t('enterAmount')}
        name="amount"
        keyboardType="phone-pad"
        control={control}
        rules={{
          required: { value: true, message: t('amountRequired') },
        }}
        marginTop="24px"
      />
    </KeyBoardScrollView>
  )
}

export default EwaBank
