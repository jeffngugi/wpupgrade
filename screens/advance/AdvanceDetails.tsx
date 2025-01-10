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
import { Box } from 'native-base'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'

interface Props {
  navigation: MainNavigationProp<AdvanceRoutes.Detail>
  route: MainNavigationRouteProp<AdvanceRoutes.Advance>
}

const AdvanceDetails = ({ navigation, route }: Props) => {
  const item = route.params.item
  const [editing, setEditing] = useState(false)
  const title = editing ? 'Edit salary advance' : ''
  const toggleEdit = () => setEditing(!editing)
  const handleGoBack = () => {
    editing ? toggleEdit() : navigation.goBack()
  }

  useStatusBarBackgroundColor('white')

  return (
    <ScreenContainer>
      <ScreenHeader title={title} onPress={handleGoBack} close={editing} />
      <Box height={'24px'} />
      {editing ? <AdvanceEdit /> : <AdvanceDetailView item={item} />}
    </ScreenContainer>
  )
}

export default AdvanceDetails
