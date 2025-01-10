import React, { useEffect, useState } from 'react'

import { Box, Text, Toast } from 'native-base'

import { noop } from 'lodash'
import { Platform, Pressable } from 'react-native'
import { QueryClient } from '@tanstack/react-query'
import { userQKeys, walletQKeys } from '~api/QueryKeys'
import SuccessAlert from '~components/SuccessAlert'
import { State } from '~declarations'
import { useSelector } from 'react-redux'

import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import UserAvatar from '~components/UserAvatar'
import DocumentPickerModal from '~components/modals/DocumentPickerModal'
import { useGetWalletUser, useUploadProfilePicWallet } from '~api/wallet'
import LoadingModal from '~components/modals/LoadingModal'

const WalletProfileHero = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { data: userData, isLoading, isFetched } = useGetWalletUser()

  const rand = Math.floor(Math.random() * 1000)
  const imagePath = `${userData?.data?.profile?.profile_picture}?${rand}`

  const { mutate, isLoading: updatingPhoto } = useUploadProfilePicWallet()

  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const queryClient = new QueryClient()

  const handleSetPhoto = (photo: any) => {
    const data = new FormData()
    if (photo.uri) {
      data.append('uuid', userData?.data?.uuid ?? '')
      data.append('profile_picture', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        employee_id: employee_id as string,
      })

      mutate(data, {
        onSuccess: data => {
          queryClient.invalidateQueries([walletQKeys.user])
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
        },
        onError: () => {},
      })
    }
  }
  const name = `${userData?.data?.employee_name ?? '-'}`
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')

  return (
    <>
      <Box alignItems="center" paddingBottom="32px">
        <UserAvatar fallback={initials} url={imagePath} />
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
      <LoadingModal
        isVisible={updatingPhoto || isLoading}
        message="Updating photo..."
      />
    </>
  )
}

export default WalletProfileHero
