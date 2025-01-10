import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import ScreenContainer from '~components/ScreenContainer'
import AdvanceEdit from './components/AdvanceEdit'
import AdvanceDetailView from './components/AdvanceDetailView'
import EditDelBtns from '~components/EditDelBtns'
import {
  AdvanceRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
} from '~types'
import { Box, HStack, Pressable } from 'native-base'
import EditIcon from '~assets/svg/edit.svg'
import DelIcon from '~assets/svg/delete.svg'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import OvertimeDetails from './OvertimeDetails'
import OvertimeEdit from './OvertimeEdit'
import DeleteModal from '~components/modals/DeleteModal'

interface Props {
  navigation: MainNavigationProp<AdvanceRoutes.Detail>
  route: MainNavigationRouteProp<AdvanceRoutes.Advance>
}

const OvertimeDetail = ({ navigation, route }: Props) => {
  const item = route.params.item
  const [editing, setEditing] = useState(false)
  const toggleEdit = () => setEditing(!editing)
  const [deleteModal, setDeleteModal] = useState(false)
  const toggleScreen = () => setEditing(!editing)

  const handleGoBack = () => {
    editing ? toggleEdit() : navigation.goBack()
  }

  const handleDelete = () => {
    setDeleteModal(false)
  }

  useStatusBarBackgroundColor('white')
  const ActionBtns = () => {
    return (
      <HStack>
        <Pressable onPress={toggleScreen} mx="10px">
          <EditIcon color="#253545" />
        </Pressable>
        <Pressable onPress={() => setDeleteModal(true)}>
          <DelIcon color="#253545" />
        </Pressable>
      </HStack>
    )
  }
  return (
    <Box flex={1} safeArea bgColor="white" px="16px">
      <ScreenHeader
        title={editing ? 'Edit overtime details' : 'Overtime Details'}
        onPress={handleGoBack}
        // RightItem={editing ? undefined : ActionBtns}
        close={editing}
      />

      {/* <Box height={'24px'} /> */}
      {editing ? (
        <OvertimeEdit navigation={navigation} />
      ) : (
        <OvertimeDetails item={item} />
      )}
      <DeleteModal
        loading={false}
        title={'Delete Overtime'}
        description={'Do you want to delete this overtime?'}
        onDelete={handleDelete}
        isVisible={deleteModal}
        hideModal={() => setDeleteModal(false)}
      />
    </Box>
  )
}

export default OvertimeDetail
