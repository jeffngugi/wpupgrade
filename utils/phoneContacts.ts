import { useState, useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import Contacts from 'react-native-contacts'

export interface IPhoneContact {
  recordID: string
  givenName: string
  phoneNumber: string
}

const useContacts = () => {
  const [contacts, setContacts] = useState<IPhoneContact[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleContacts = async () => {
      if (Platform.OS === 'ios') {
        await getContacts()
      } else if (Platform.OS === 'android') {
        try {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          )

          if (permission === 'granted') {
            await getContacts()
          }
        } catch (error) {
          console.log('Contacts errors', error)
        }
      }
    }

    const getContacts = async () => {
      try {
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

        const contactsArr = result
          .map(
            ({
              recordID,
              givenName,
              middleName,
              familyName,
              phoneNumbers,
            }) => ({
              recordID,
              givenName: [givenName, middleName, familyName]
                .filter(Boolean)
                .join(' '),
              phoneNumber: phoneNumbers[0]?.number,
            }),
          )
          .filter(minimalContact => !!minimalContact.phoneNumber)

        setContacts(contactsArr)
      } catch (error) {
        console.log('Error fetching contacts', error)
      } finally {
        setLoading(false)
      }
    }

    handleContacts()
  }, [])

  return { contacts, loading }
}

export default useContacts
