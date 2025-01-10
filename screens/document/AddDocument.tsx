import { isEmpty, isNil, noop } from 'lodash'
import { Box, Button, ScrollView, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { useAddDocument, useDocumentCategories } from '~api/document'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import { State } from '~declarations'
import DocumentButton from '../../components/buttons/DocumentBtn'
import CommonInput from '../../components/inputs/CommonInput'
import DocumentPickerModal from '../../components/modals/DocumentPickerModal'
import LoadingModal from '../../components/modals/LoadingModal'
import SuccessModal from '../../components/modals/SuccessModal'
import ScreenHeader from '../../components/ScreenHeader'
import DocumentPlaceHolder from './components/DocumentPlaceHolder'
import SubmitButton from '~components/buttons/SubmitButton'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'

const AddDocument = ({ navigation }) => {
  const { control, handleSubmit } = useForm()
  const [modal, setModal] = useState(false)
  const [documentName, setDocumentName] = useState('')
  const [successModal, setSuccessModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [photoItem, setPhotoItem] = useState<any>()
  const [items, setItems] = useState<optionsType[]>([])
  const { data: categories, isLoading } = useDocumentCategories()
  const { mutate, isLoading: submiting } = useAddDocument()

  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  useEffect(() => {
    if (!isNil(categories.data.data)) createDocCat()
  }, [])

  const createDocCat = () => {
    if (!isEmpty(categories.data.data)) {
      const newArrayOfObj = categories.data.data.map(
        ({ name: label, id: value }) => ({
          label,
          value,
        }),
      )
      setItems(newArrayOfObj)
    } else {
      setItems([])
    }
  }
  const data = new FormData()
  const onSubmit = (formData: any) => {
    if (!photoItem) {
      Alert.alert('Please attach a document')
      return
    }
    analyticsTrackEvent(AnalyticsEvents.Documents.upload_document, {
      category: formData.category,
      name: formData.title,
    })
    data.append('name', formData.title)
    data.append('document_category_id', formData.category)
    data.append('external_type', 'EMPLOYEE')
    data.append('external_id', employee_id as string)
    data.append('files[0]', photoItem)

    mutate(data, {
      onSuccess: () => {
        setSuccessModal(true)
        analyticsTrackEvent(AnalyticsEvents.Documents.upload_document_success, {
          category: formData.category,
          name: formData.title,
        })
      },
      onError: () => {
        analyticsTrackEvent(AnalyticsEvents.Documents.upload_document_failure, {
          category: formData.category,
          name: formData.title,
        })
      },
    })
  }

  const handleFileUpload = (file: any) => {
    if (!file) return
    const fileData = {
      name: file.name,
      type: file.type,
      uri: file.uri,
    }
    setDocumentName(file.name)
    setPhotoItem(fileData)
  }

  const handleSetPhoto = (photo: any) => {
    if (!photo) return
    const photoData = {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    }
    setDocumentName(photo.fileName)
    setPhotoItem(photoData)
  }

  return (
    <Box safeArea flex={1} px="16px" bgColor="white">
      <ScreenHeader
        onPress={() => navigation.goBack()}
        close
        title="Add document"
      />
      <ScrollView flex={1} mt={'24px'}>
        <CommonInput
          name="title"
          control={control}
          label="Title"
          mb="24px"
          rules={{
            required: { value: true, message: 'Title is required' },
          }}
        />
        <Text fontSize="14px" color="grey" fontFamily="body" mb="5px">
          Category
        </Text>
        <DropDownPicker
          control={control}
          value={category}
          open={open}
          options={items}
          setOptions={setItems}
          setValue={setCategory}
          setOpen={setOpen}
          loading={isLoading}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
          name="category"
        />
        <Box my="10px" />

        <Box my="20px">
          {!isEmpty(documentName) ? (
            <DocumentPlaceHolder name={documentName} />
          ) : (
            <DocumentButton
              label="Add document"
              onPress={() => setModal(true)}
            />
          )}
        </Box>
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        mb="32px"
        title="Add Document"
      />

      <DocumentPickerModal
        onUserCanceled={() => setModal(false)}
        isVisible={modal}
        hideModal={() => setModal(false)}
        onBackdropPress={() => setModal(false)}
        // showCamera
        allowFiles
        setFile={noop}
        setFileItem={file => handleFileUpload(file)}
        setPhotoURI={noop}
        setPhotoItem={photo => handleSetPhoto(photo)}
      />
      <SuccessModal
        title="Document uploaded successfully"
        message=""
        btnLabel="Back to module"
        onPressBtn={() => {
          setSuccessModal(false)
          navigation.goBack()
        }}
        isOpen={successModal}
        onHide={() => setSuccessModal(false)}
      />
      <LoadingModal message="Adding document" isVisible={submiting} />
    </Box>
  )
}

export default AddDocument
