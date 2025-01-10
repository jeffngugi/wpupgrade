import { Box, HStack, Pressable } from 'native-base'
import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import EditIcon from '~assets/svg/edit.svg'
import DelIcon from '~assets/svg/delete.svg'
import LeaveDetailView from './component/LeaveDetailView'
import { TLeaveItem } from './types'
import { useTranslation } from 'react-i18next'
import { parseISO } from '~utils/date'
import { isAfter } from 'date-fns'
import { TRelieverFilter, useDeleteLeave, useGetRelievers } from '~api/leave'
import DeleteModal from '~components/modals/DeleteModal'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { LEAVE_STATUS } from './constants'
import LeaveForm from './containers/LeaveForm'
import { NavigationProp, RouteProp } from '@react-navigation/native'

type LeaveDetailsProps = {
  route: RouteProp<{ params: { item: TLeaveItem } }, 'params'>;
  navigation: NavigationProp<any>;
};

const LeaveDetails = ({ route, navigation }: LeaveDetailsProps) => {
  const { t } = useTranslation('leaves')
  const leaveItem = route?.params?.item
  const [editing, setEditing] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const toggleScreen = () => setEditing(!editing)
  const relieverFilter: TRelieverFilter = {
    searchText: leaveItem?.reliever_name ? leaveItem?.reliever_name : '',
    status: 'ACTIVE',
  }
  useGetRelievers(relieverFilter)
  const { mutate, isLoading } = useDeleteLeave()
  const handleDelete = () => {
    mutate(leaveItem.id, {
      onSuccess: () => {
        setDeleteModal(false)
        navigation.goBack()
      },
      onError: () => setDeleteModal(false),
    })
  }
  useStatusBarBackgroundColor('white')
  const editable =
    isAfter(parseISO(leaveItem.from), Date.now()) &&
    leaveItem.status != LEAVE_STATUS.APPROVED &&
    leaveItem.status != LEAVE_STATUS.DISAPPROVED

  const handleGoBack = () => {
    editing ? toggleScreen() : navigation.goBack()
  }
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
        title={editing ? t('leave_editing') : t('leave_details')}
        onPress={handleGoBack}
        RightItem={editable && !editing ? ActionBtns : undefined}
        close={editing}
      />
      {editing ? (
        <LeaveForm navigation={navigation} item={leaveItem} isEdit={true} />
      ) : (
        <LeaveDetailView item={leaveItem} />
      )}
      <DeleteModal
        loading={isLoading}
        title={t('delete_title')}
        description={t('delete_description')}
        onDelete={handleDelete}
        isVisible={deleteModal}
        hideModal={() => setDeleteModal(false)}
      />
    </Box>
  )
}

export default LeaveDetails
