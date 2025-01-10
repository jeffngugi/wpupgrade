import { useNavigation } from '@react-navigation/native'
import { isEmpty, isNil } from 'lodash'
import { Box, Button, ScrollView, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useDocumentCategories, useEditDocument } from '~api/document'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import { State } from '~declarations'
import CommonInput from '../../../components/inputs/CommonInput'
import LoadingModal from '../../../components/modals/LoadingModal'
import { TDocItem } from './DocumentCard'
import DocumentPlaceHolder from './DocumentPlaceHolder'
import SubmitButton from '~components/buttons/SubmitButton'

const EditDocument = ({ document }: { document: TDocItem }) => {
  const navigation = useNavigation()
  const { handleSubmit, control, setValue } = useForm()
  const [category, setCategory] = useState('')
  const [items, setItems] = useState<optionsType[]>([])
  const [open, setOpen] = useState(false)
  const { data: categories } = useDocumentCategories()
  const { mutate, isLoading } = useEditDocument()
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const onSubmit = formData => {
    const data = new FormData()
    data.append('name', formData.title)
    data.append('document_category_id', formData.category)
    data.append('external_type', 'EMPLOYEE')
    data.append('external_id', employee_id as string)
    data.append('id', document.id)
    mutate(
      { data, id: document.id },
      {
        onSuccess: () => {
          navigation.goBack()
        },
      },
    )
  }

  useEffect(() => {
    setValue('title', document.name)
    setValue('category', document.document_category_id)
    setCategory(document.document_category_id)
  }, [])

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

  return (
    <Box flex={1}>
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
        <Box my="100px" flex={1} />
      </ScrollView>

      <SubmitButton onPress={handleSubmit(onSubmit)} title="Save Document" />
      <LoadingModal message="Saving document" isVisible={isLoading} />
    </Box>
  )
}

export default EditDocument
