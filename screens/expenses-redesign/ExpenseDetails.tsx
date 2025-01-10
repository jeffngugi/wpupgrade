import React, { useState } from 'react'
import { Box } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import ExpenseDetailView from './containers/ExpenseDetailView'
import EditDelBtns from '~components/EditDelBtns'
import { useExpensesDeleteMutation } from '~api/expenses'
import DeleteModal from '~components/modals/DeleteModal'
import ExpenseForm from './containers/ExpenseForm'
import KeyBoardScrollView from '~components/KeyBoardScrollView'
import { RouteProp, NavigationProp } from '@react-navigation/native'
import { TExpenseItem } from './types'
import { STAGES } from './RecordExpense'

type ExpenseDetailsProps = {
  route: RouteProp<{ params: { item: TExpenseItem } }, 'params'>
  navigation: NavigationProp<any>
}

const ExpenseDetails = ({ route, navigation }: ExpenseDetailsProps) => {
  const [currentStage, setCurrentStage] = useState<typeof STAGES[keyof typeof STAGES]>(STAGES[1])
  const [editing, setEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const toggleScreen = () => setEditing(!editing)
  const item = route.params.item
  const deleteAdvance = useExpensesDeleteMutation()

  const haveActions =
    (item?.is_certified && !item?.is_approved && item?.status === 'NOTPAID')

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

    if (currentStage === STAGES[2]) {
      setCurrentStage(STAGES[1])
    } else {
      if (editing) {
        toggleScreen()
        return
      }
      navigation.goBack()
    }

  }

  const RightItem = () => (
    <EditDelBtns
      onPressDel={() => setShowDeleteModal(!showDeleteModal)}
      onPressEdit={toggleScreen}
    />
  )

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
            <ExpenseForm
              item={item}
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
              isImprest={item?.is_imprest}
            />
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
