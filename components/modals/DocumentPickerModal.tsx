import React from 'react'
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'
import {
  DocumentPickerOptions,
  pickSingle as pickDocument,
  types as docTypes,
} from 'react-native-document-picker'
import CommonModal from './CommonModal'
import FileIcon from '../../assets/svg/file.svg'
import CameraIcon from '../../assets/svg/camera.svg'
import DocOption from '../DocOption'
import {
  DocSelectionChoice,
  documentOption,
  DocumentPickerModalProps,
} from './types'
import { noop } from 'lodash'
import { PermissionsAndroid, Platform } from 'react-native'
import { Toast } from 'native-base'
import ErrorAlert from '~components/ErrorAlert'

const DocumentPickerModal = ({
  isVisible,
  hideModal,
  onBackdropPress,
  showCamera,
  allowFiles,
  setPhotoURI,
  setFile,
  setFileItem,
  onUserCanceled,
  setPhotoItem,
}: DocumentPickerModalProps) => {
  const documentOptions: documentOption[] = [
    {
      text: 'Open Gallery',
      onPress: () => handleDocument('gallery'),
      Icon: FileIcon,
    },
    ...(showCamera
      ? [
          {
            text: 'Open Camera',
            onPress: () => handleDocument('camera'),
            Icon: CameraIcon,
          },
        ]
      : []),
    ...(allowFiles
      ? [
          {
            text: 'Choose file',
            onPress: () => handleDocument('file'),
            Icon: CameraIcon,
          },
        ]
      : []),
  ]

  const onHandleResponse = (response: ImagePickerResponse) => {
    hideModal()
    if (response.didCancel) {
      onUserCanceled()
    }
    if (response.assets) {
      const photo = response.assets[0]
      if (photo.uri) {
        let assetType: 'image' | undefined
        if (photo.type === 'image') assetType = photo.type
        setPhotoURI(photo.uri, assetType)
        setPhotoItem ? setPhotoItem(photo) : noop
      }
    }
  }

  const handleDocument = async (action: DocSelectionChoice) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.1,
    }

    const checkCameraPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true
      }
      Toast.show({
        render: () => <ErrorAlert description="Camera permission denied" />,
        placement: 'top',
        top: 100,
        duration: 3000,
      })
      return false
    }

    const handleCamera = async () => {
      try {
        setTimeout(() => {
          launchCamera(options, async response => {
            await onHandleResponse(response)
            hideModal()
          })
        }, 400)
      } catch (err) {
        console.warn(err)
      }
    }

    if (action === 'file') {
      const { doc, docx, pdf, ppt, pptx } = docTypes
      const options: DocumentPickerOptions<'android' | 'ios'> = {
        type: [doc, docx, pdf, ppt, pptx],
      }
      try {
        setTimeout(async () => {
          const file = await pickDocument(options)

          const { uri, name } = file
          await setFile({ uri, name })
          setFileItem ? await setFileItem(file) : noop
          hideModal()
        }, 400)
      } catch (error) {
        setFile(undefined)
      }
    }

    if (action === 'camera') {
      handleCamera()
    }
    if (action === 'gallery') {
      setTimeout(() => {
        launchImageLibrary(options, async response => {
          await onHandleResponse(response)
          hideModal()
        })
      }, 400)
    }
  }

  return (
    <CommonModal
      isVisible={isVisible}
      hideModal={hideModal}
      onBackdropPress={onBackdropPress}>
      {documentOptions.map((option, index) => {
        const { text, onPress, Icon } = option
        return (
          <DocOption
            key={index.toString()}
            text={text}
            onPress={onPress}
            Icon={Icon}
          />
        )
      })}
    </CommonModal>
  )
}

export default DocumentPickerModal
