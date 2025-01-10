import { Box } from 'native-base'
import React, { useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import { AdvanceLoanRoutes } from '~types'
import { useRoute } from '@react-navigation/native'
import EditDelBtns from '~components/EditDelBtns'
import AdvanceLoanForm from './containers/AdvanceLoanForm'
import AdvanceLoanDetails from './containers/LoanDetail'

const LoanDetails = ({ navigation }) => {
  const route = useRoute()
  const { loanDetail } = route.params
  const haveActions =
    loanDetail.status === 'PENDING' || loanDetail.status === 'CERTIFIED'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const toggleScreen = () => setEditing(!editing)

  const RightItem = () => (
    <EditDelBtns
      onPressDel={() => setShowDeleteModal(!showDeleteModal)}
      onPressEdit={toggleScreen}
    />
  )

  return (
    <Box safeArea flex={1} backgroundColor="white" px="16px">
      <ScreenHeader
        onPress={() => navigation.navigate(AdvanceLoanRoutes.Loan)}
        title="Loan details"
        close
        RightItem={haveActions ? (editing ? undefined : RightItem) : undefined}
      />
      <Box mt="24px" />
      {editing ? (
        <AdvanceLoanForm item={loanDetail} navigation={navigation} />
      ) : (
        <AdvanceLoanDetails
          loanDetail={loanDetail}
          navigation={navigation}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </Box>
  )
}

export default LoanDetails
