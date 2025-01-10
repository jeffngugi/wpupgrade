import { Box, Pressable } from 'native-base'
import React, { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import EditIcon from '../../assets/svg/edit.svg'
import EditDocument from './components/EditDocument'
import DocumentDetails from './components/DocumentDetails'

const Document = ({ route, navigation }) => {
  const [editing, setEditing] = useState(false)
  const heading: string = editing ? 'Edit document' : 'Document details'
  const toggleScreen = () => setEditing(!editing)

  const { document } = route.params

  const RightItem = () => (
    <Pressable onPress={toggleScreen}>
      <EditIcon color="#253545" />
    </Pressable>
  )
  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader
        onPress={() => navigation.goBack()}
        title={heading}
        RightItem={editing ? undefined : RightItem}
        close={editing}
      />
      {editing ? (
        <EditDocument document={document} />
      ) : (
        <DocumentDetails document={document} />
      )}
    </Box>
  )
}

export default Document
