import React, { useEffect, useState } from 'react'
import { Box, Pressable, ScrollView, Text } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import ChevRight from '~assets/svg/chev-right.svg'
import PhoneContactModal from '~components/PhoneContactModal'
import { PermissionsAndroid, Platform } from 'react-native'
import Contacts from 'react-native-contacts'
import { Control, FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TEwaFavourite } from '~types'

export interface EwaFormProps {
  control: Control<FieldValues, object>
}

interface Props extends EwaFormProps {
  setValue: UseFormSetValue<FieldValues>
  item: TEwaFavourite | undefined
}

export type IPhoneContact = {
  recordID: string
  givenName: string
  phoneNumber: string
}

const EwaMpesa = ({ control, setValue, item }: Props) => {
  const [phoneBook, setPhoneBook] = useState<boolean>(false)
  const [filteredDataSource, setFilteredDataSource] = useState<any>([])
  const [phoneContacts, setPhoneContacts] = useState<any>([])
  const { t } = useTranslation('ewa')
  const handleContacts = async () => {
    if (Platform.OS === 'ios') {
      getContacts()
    } else if (Platform.OS === 'android') {
      try {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        )

        if (permission === 'granted') {
          getContacts()
        }
      } catch (errors) {
        console.log('Contacts errors')
      }
    }
  }

  let contactsArr: IPhoneContact[] = []
  const getContacts = async () => {
    const result = await Contacts.getAllWithoutPhotos()
    result.sort((a, b) => {
      if (a.givenName < b.givenName) {
        return -1
      }
      if (a.givenName > b.givenName) {
        return 1
      }
      return 0
    })

    contactsArr = result
      .map(({ recordID, givenName, middleName, familyName, phoneNumbers }) => ({
        recordID,
        givenName: [givenName, middleName, familyName]
          .filter(Boolean)
          .join(' '),
        phoneNumber: phoneNumbers[0]?.number,
      }))
      .filter(minimalContact => !!minimalContact.phoneNumber)
    setFilteredDataSource(contactsArr)
    setPhoneContacts(contactsArr)
  }

  useEffect(() => {
    if (item) {
      setValue('recipient_number', item?.mobile)
    }
  }, [item])

  const handleOpenPhoneBook = async () => {
    await handleContacts()
    setPhoneBook(true)
  }

  const handleSelectContact = (item: string) => {
    setValue('recipient_number', item.replace(/\D/g, ''))
    setPhoneBook(false)
  }

  const handleSearchContact = (text: string) => {
    if (text) {
      const newData = phoneContacts.filter(function (item: {
        givenName: string
      }) {
        const itemData = item.givenName
          ? item.givenName.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setFilteredDataSource(newData)
    } else {
      setFilteredDataSource(phoneContacts)
    }
  }

  return (
    <ScrollView flex={1}>
      <CommonInput
        label={t('enterPhone')}
        name="recipient_number"
        control={control}
        keyboardType="phone-pad"
        rules={{
          required: { value: true, message: t('phoneRequired') },
        }}
      />
      <Pressable
        flexDirection="row"
        alignItems={'center'}
        justifyContent="space-between"
        marginTop="22px"
        marginBottom="16px"
        onPress={handleOpenPhoneBook}>
        <Text fontSize="16px" color="green.50">
          {t('chooseContact')}
        </Text>
        <ChevRight color="#62A446" />
      </Pressable>
      <CommonInput
        label={t('enterAmount')}
        name="amount"
        control={control}
        keyboardType="phone-pad"
        rules={{
          required: { value: true, message: t('amountRequired') },
        }}
      />
      <PhoneContactModal
        visible={phoneBook}
        setVisible={setPhoneBook}
        contacts={filteredDataSource}
        onPressContact={handleSelectContact}
        handleSearchContact={handleSearchContact}
      />
    </ScrollView>
  )
}

export default EwaMpesa
