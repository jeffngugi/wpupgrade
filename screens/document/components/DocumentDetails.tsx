import { isString, noop } from 'lodash'
import { Box, Pressable } from 'native-base'
import React from 'react'
import { Linking } from 'react-native'
import DocItem from './DocItem'
import { TDocItem } from './DocumentCard'
import DocumentPlaceHolder from './DocumentPlaceHolder'

const DocumentDetails = ({ document }: { document: TDocItem }) => {
  let docfileName = 'file'
  const handleLink = () => {
    Linking.openURL(document.path).catch(err => noop())
  }
  if (isString(document.path)) {
    const splitDoc = document.path.split('/')
    if (isString(splitDoc[5])) {
      docfileName = splitDoc[5]
    }
  }
  return (
    <Box flex={1}>
      <Box h="22px" />
      <DocItem label="Title" value={document.name ?? '-'} />
      <DocItem label="Category" value={document.type ?? '-'} />
      <Pressable mt="20px" onPress={handleLink}>
        <DocumentPlaceHolder name={docfileName} />
      </Pressable>
    </Box>
  )
}

export default DocumentDetails
