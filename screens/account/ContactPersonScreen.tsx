import React, { useState } from 'react'
import { Box, Pressable, ScrollView, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import ContactItemHead from './components/ContactItemHead'
import ContactItem from './components/ContactItem'
import SwipableModal from '../../components/modals/SwipableModal'
import DeleteIcon from '../../assets/svg/delete.svg'
import EditIcon from '../../assets/svg/edit.svg'
import DeleteModal from '../../components/modals/DeleteModal'
import { AccountsRoutes, MainStackParamList } from '../../types'
import {
  useDeleteEmergency,
  useEmergencyContact,
  useNextOfKin,
  useDeleteNextOfKin,
} from '~api/account'
import LoaderScreen from '~components/LoaderScreen'
import { useCanEditAccount } from '~utils/hooks/useCanEditAccount'
import { noop } from 'lodash'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

export type TNextOfKin = {
  contact: string
  created_at: Date | string
  id: number | string
  name: string
  relationship: string
}

const ContactPersonScreen = ({
  navigation,
}: {
  navigation: MainStackParamList
}) => {
  const { mutate: deleteEmergency } = useDeleteEmergency()
  const { mutate: deleteNextOfKin } = useDeleteNextOfKin()
  const { data, isLoading } = useEmergencyContact()
  const { data: nextOfKins, isLoading: nokLoading } = useNextOfKin()
  const emergencyDatas = data?.data

  useStatusBarBackgroundColor('white')
  const canEditContacts = useCanEditAccount('update_contact_details')
  const nextOfKinDatas: TNextOfKin[] = nextOfKins?.data

  const [actionSheet, setActionSheet] = useState<boolean>(false)
  const [actionSheet2, setActionSheet2] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [nextOfKinModal, setNextOfKinModal] = useState<boolean>(false)
  const [emergencyContant, setEmergencyContact] = useState()
  const [nextOfKin, setNextOfKin] = useState<TNextOfKin>()

  const handleNextOfKin = async (
    item: React.SetStateAction<TNextOfKin | undefined>,
  ) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.open_contact_modal, {})
    await setNextOfKin(item)
    setActionSheet(true)
  }

  const handleEmergency = async (item: React.SetStateAction<undefined>) => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.open_contact_modal, {})
    await setEmergencyContact(item)
    setActionSheet2(true)
  }

  const closeActionSheets = () => {
    setActionSheet(false)
    setActionSheet2(false)
  }

  const deleteEmergencyContact = () => {
    analyticsTrackEvent(AnalyticsEvents.Accounts.delete_emergency_contact, {})
    deleteEmergency(emergencyContant?.id, {
      onSuccess: () => {
        setDeleteModal(false)
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.delete_emergency_contact_success,
          {},
        )
      },
      onError: () => setDeleteModal(false),
    })
  }

  const deleteKinContact = () => {
    closeActionSheets()
    analyticsTrackEvent(AnalyticsEvents.Accounts.delete_next_of_kin, {})
    deleteNextOfKin(nextOfKin?.id, {
      onSuccess: () => {
        setNextOfKinModal(false)
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.delete_next_of_kin_success,
          {},
        )
      },
      onError: () => {
        setNextOfKinModal(false)
        analyticsTrackEvent(
          AnalyticsEvents.Accounts.delete_next_of_kin_error,
          {},
        )
      },
    })
  }

  const openDelEmergencyModal = () => {
    closeActionSheets()
    setTimeout(() => setDeleteModal(true), 500)
    analyticsTrackEvent(AnalyticsEvents.Accounts.open_delete_contact_modal, {})
  }

  const openDelKinModal = () => {
    closeActionSheets()
    setTimeout(() => setNextOfKinModal(true), 500)
  }

  const handleEditNextOfKin = () => {
    setActionSheet(false)
    navigation.navigate(AccountsRoutes.EditNextOfKin, { nextOfKin })
  }

  const handleEditEmergency = () => {
    closeActionSheets()
    navigation.navigate(AccountsRoutes.EditContactPerson, { emergencyContant })
  }

  if (isLoading || nokLoading) return <LoaderScreen />
  // const canEditContacts = true

  // console.log('Jeff', jeff)
  return (
    <Box safeArea flex={1} backgroundColor="white">
      <ScrollView backgroundColor="white" paddingX="16px" flex={1}>
        <ScreenHeader
          title="Contact Persons"
          onPress={() => navigation.goBack()}
        />
        <Box marginTop="40px" />
        <ContactItemHead
          onPress={() => navigation.navigate(AccountsRoutes.AddNextOfKin)}
          title="Next of Kin"
          hidden={!canEditContacts}
        />
        {nextOfKinDatas.map((item, index) => (
          <ContactItem
            key={index.toString()}
            onPress={canEditContacts ? () => handleNextOfKin(item) : noop}
            name={item.name ?? '-'}
            contact={item.contact ?? '-'}
          />
        ))}
        <Box marginTop="40px">
          <ContactItemHead
            onPress={() => navigation.navigate(AccountsRoutes.AddContactPerson)}
            title="Emergency Contacts"
            hidden={!canEditContacts}
          />
          {emergencyDatas.map((item, index) => (
            <ContactItem
              key={index.toString()}
              onPress={canEditContacts ? () => handleEmergency(item) : noop}
              name={item.name ?? '-'}
              contact={item.contact ?? '-'}
            />
          ))}
        </Box>
      </ScrollView>

      <DeleteModal
        title="Delete contact"
        description="Are you sure you want to emergency contact?"
        onDelete={deleteEmergencyContact}
        isVisible={deleteModal}
        hideModal={() => setDeleteModal(false)}
        closeIcon
      />
      <DeleteModal
        title="Delete next of kin"
        description="Are you sure you want to delete your next of kin information?"
        onDelete={deleteKinContact}
        isVisible={nextOfKinModal}
        hideModal={() => setNextOfKinModal(false)}
        closeIcon
      />
      <SwipableModal
        isOpen={actionSheet}
        onHide={closeActionSheets}
        onBackdropPress={closeActionSheets}>
        <>
          <Box paddingX="16px" paddingBottom="30px">
            <Pressable
              flexDirection="row"
              alignItems="center"
              onPress={handleEditNextOfKin}>
              <EditIcon color="#536171" />
              <Text
                color="charcoal"
                marginLeft="20px"
                fontFamily={'heading'}
                fontSize={'16px'}>
                Edit next of kin details
              </Text>
            </Pressable>
            <Pressable
              flexDirection="row"
              marginTop="26px"
              alignItems="center"
              onPress={openDelKinModal}>
              <DeleteIcon color="#F14B3B" />
              <Text
                marginLeft="20px"
                color="charcoal"
                fontFamily={'heading'}
                fontSize={'16px'}>
                Delete next of kin
              </Text>
            </Pressable>
          </Box>
        </>
      </SwipableModal>
      <SwipableModal
        isOpen={actionSheet2}
        onHide={closeActionSheets}
        onBackdropPress={closeActionSheets}>
        <>
          <Box paddingX="16px" paddingBottom="30px" paddingTop={'10px'}>
            <Pressable
              flexDirection="row"
              alignItems="center"
              onPress={handleEditEmergency}>
              <EditIcon color="#536171" />
              <Text
                color="charcoal"
                marginLeft="20px"
                fontFamily={'heading'}
                fontSize={'16px'}>
                Edit emergency contact
              </Text>
            </Pressable>
            <Pressable
              flexDirection="row"
              marginY="26px"
              alignItems="center"
              onPress={openDelEmergencyModal}>
              <DeleteIcon color="#F14B3B" />
              <Text
                marginLeft="20px"
                color="charcoal"
                fontFamily={'heading'}
                fontSize={'16px'}>
                Delete emergency contact
              </Text>
            </Pressable>
          </Box>
        </>
      </SwipableModal>
    </Box>
  )
}

export default ContactPersonScreen
