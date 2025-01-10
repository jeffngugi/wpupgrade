import React from 'react'
import SwipableModal from './SwipableModal'
import { Box, Pressable, Text } from 'native-base'
import DeleteIcon from '~assets/svg/delete.svg'
import EditIcon from '~assets/svg/edit.svg'

type Props = {
  isOpen: boolean
  hideModal: () => void
  handleDelete: () => void
  handleEdit: () => void
  editLabel?: string
  deleteLabel?: string
}

const EditDeleteModal = ({
  isOpen,
  hideModal,
  handleDelete,
  handleEdit,
  editLabel,
  deleteLabel,
}: Props) => {
  return (
    <SwipableModal
      isOpen={isOpen}
      onHide={hideModal}
      onBackdropPress={hideModal}>
      <>
        <Box paddingX="16px" paddingBottom="30px">
          <Pressable
            flexDirection="row"
            alignItems="center"
            onPress={handleEdit}>
            <EditIcon color="#536171" />
            <Text
              color="charcoal"
              marginLeft="20px"
              fontFamily={'heading'}
              fontSize={'16px'}>
              {editLabel ?? 'Edit'}
            </Text>
          </Pressable>
          <Pressable
            flexDirection="row"
            marginTop="26px"
            alignItems="center"
            onPress={handleDelete}>
            <DeleteIcon color="#F14B3B" />
            <Text
              marginLeft="20px"
              color="charcoal"
              fontFamily={'heading'}
              fontSize={'16px'}>
              {deleteLabel ?? 'Delete'}
            </Text>
          </Pressable>
        </Box>
      </>
    </SwipableModal>
  )
}

export default EditDeleteModal
