import React from 'react'
import { Box } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import LoaderScreen from '../../components/LoaderScreen'
import NoDocument from './components/NoDocument'
import DocumentsListing from './components/DocumentsListing'
import { useDocumentCategories, useGetDocuments } from '~api/document'
import { isNil } from 'lodash'

const Documents = ({ navigation }) => {
  const { isLoading, data } = useGetDocuments()
  useDocumentCategories()
  if (isLoading) {
    return <LoaderScreen />
  }

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader title="Documents" onPress={() => navigation.goBack()} />

      {!isNil(data.data.data[0]) ? <DocumentsListing /> : <NoDocument />}
    </Box>
  )
}

export default Documents
