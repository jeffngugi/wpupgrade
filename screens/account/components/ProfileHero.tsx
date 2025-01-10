import React, { useState } from 'react'
import DocumentPickerModal from '../../../components/modals/DocumentPickerModal'
import { Box, Button, Text, Toast } from 'native-base'
import UserAvatar from '../../../components/UserAvatar'
import { useUploadProfilePic, useMyProfile } from '~api/account'
import { noop } from 'lodash'
import { Platform, Pressable } from 'react-native'
import { QueryClient } from '@tanstack/react-query'
import { userQKeys } from '~api/QueryKeys'
import SuccessAlert from '~components/SuccessAlert'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import { useFetchProfile } from '~api/home'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const ProfileHero = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { data } = useMyProfile()
  const { data: profileData } = useFetchProfile()
  const { mutate } = useUploadProfilePic()
  const [photo, setPhoto] = useState(profileData?.data?.avatar)
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const queryClient = new QueryClient()

  const handleSetPhoto = (photo: any) => {
    const data = new FormData()
    if (photo.uri) {
      setPhoto(photo.uri)
      data.append('employee_id', employee_id as string)
      data.append('image[0]', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        employee_id: 53058,
      })
      mutate(data, {
        onSuccess: data => {
          queryClient.invalidateQueries(userQKeys.myprofile)
          Toast.show({
            render: () => {
              return (
                <SuccessAlert
                  description={
                    data?.data?.message ?? 'Photo updated succesfully'
                  }
                />
              )
            },
            placement: 'top',
            top: 100,
            duration: 3000,
          })
          setTimeout(() => Toast.closeAll(), 5000)
          analyticsTrackEvent(AnalyticsEvents.Accounts.change_photo_success, {})
        },
        onError: () => {
          setPhoto(data?.data?.profile_picture ?? null)
          analyticsTrackEvent(AnalyticsEvents.Accounts.change_photo_error, {})
        },
      })
    }
  }
  const name = `${data?.data?.employee_name ?? '-'}`
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
  return (
    <>
      <Box alignItems="center" paddingBottom="32px">
        <UserAvatar fallback={initials} url={photo} />
        <Box height={'16px'} />
        <Pressable
          onPress={() => {
            analyticsTrackEvent(AnalyticsEvents.Accounts.change_photo, {})
            setModalVisible(true)
          }}>
          <Text fontSize="16px" color="green.70">
            Change Photo
          </Text>
        </Pressable>
      </Box>
      <DocumentPickerModal
        onUserCanceled={() => setModalVisible(false)}
        isVisible={modalVisible}
        hideModal={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        showCamera
        setFile={noop}
        setPhotoURI={noop}
        setPhotoItem={photo => handleSetPhoto(photo)}
      />
    </>
  )
}

export default ProfileHero
