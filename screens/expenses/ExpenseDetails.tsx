import React, { useState } from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import ExpenseDetailView from './containers/ExpenseDetailView'
import EditDelBtns from '~components/EditDelBtns'
import {
  useExpenseCategoriesFetchQuery,
  useExpensesDeleteMutation,
} from '~api/expenses'
import DeleteModal from '~components/modals/DeleteModal'
import ExpenseForm from './containers/ExpenseForm'
import KeyBoardScrollView from '~components/KeyBoardScrollView'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { TExpenseItem } from './types'
import LoaderScreen from '~components/LoaderScreen'

type ExpenseDetailsProps = {
  route: RouteProp<{ params: { item: TExpenseItem } }, 'params'>
  navigation: NavigationProp<any>
}

const ExpenseDetails = ({ route, navigation }: ExpenseDetailsProps) => {
  const [editing, setEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const toggleScreen = () => setEditing(!editing)
  const item = route.params.item
  const deleteAdvance = useExpensesDeleteMutation()
  const { isLoading } = useExpenseCategoriesFetchQuery({
    searchText: '',
  })

  const showActionsOnImprest = item?.is_imprest && item?.verification_status === null && !item?.is_approved
  const haveActions =
    (item?.is_certified && !item?.is_approved && item?.status === 'NOTPAID') || showActionsOnImprest

  const handleDelete = () => {
    const payload = {
      id: item?.id,
    }

    deleteAdvance.mutate(payload, {
      onSuccess: () => {
        setShowDeleteModal(false)
        navigation.goBack()
      },
      onError: () => {
        setShowDeleteModal(false)
      },
    })
  }

  const handleGoBack = () => {
    editing ? toggleScreen() : navigation.goBack()
  }

  const RightItem = () => (
    <EditDelBtns
      onPressDel={() => setShowDeleteModal(!showDeleteModal)}
      onPressEdit={toggleScreen}
    />
  )

  if (isLoading) return <LoaderScreen />

  return (
    <>
      <Box safeArea flex={1} backgroundColor="white" paddingX="16px">
        <ScreenHeader
          title={editing ? 'Edit expense claim' : ''}
          onPress={handleGoBack}
          RightItem={
            haveActions ? (editing ? undefined : RightItem) : undefined
          }
          close={editing ? true : false}
        />
        {editing ? (
          <KeyBoardScrollView>
            <ExpenseForm item={item} />
          </KeyBoardScrollView>
        ) : (
          <ExpenseDetailView item={item} />
        )}
      </Box>
      <DeleteModal
        title="Delete expense claim"
        description="Are you sure you want to delete your expense claim"
        onDelete={handleDelete}
        isVisible={showDeleteModal}
        btbLabel={'Delete'}
        hideModal={() => setShowDeleteModal(false)}
      />
    </>
  )
}

export default ExpenseDetails
