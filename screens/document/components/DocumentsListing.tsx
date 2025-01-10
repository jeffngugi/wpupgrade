import React from 'react'
import { Box, FlatList } from 'native-base'
import DocumentCard from './DocumentCard'
import FloatingBtn from '../../../components/FloatingBtn'
import { useNavigation } from '@react-navigation/native'
import { DocumentRoutes } from '../../../types'
import { useGetDocuments } from '~api/document'

const DocumentsListing = () => {
  const navigation = useNavigation()
  const { data } = useGetDocuments()

  const renderItem = ({ item }) => <DocumentCard item={item} />
  return (
    <Box flex={1}>
      <Box h={'24px'} />
      <FlatList data={data.data.data[0].documents} renderItem={renderItem} />
      <FloatingBtn
        onPress={() => navigation.navigate(DocumentRoutes.AddDocument)}
      />
    </Box>
  )
}

export default DocumentsListing
