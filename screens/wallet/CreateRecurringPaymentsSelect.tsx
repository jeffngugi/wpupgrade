import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.RecurringPaymentSelector>
  route: MainNavigationRouteProp<WalletRoutes.RecurringPaymentSelector>
}

const CreateRecurringPaymentsSelector = ({ navigation }: Props) => {
  return (
    <ScreenContainer>
      <ScreenHeader
        title="CreateRecurringPaymentsSelector"
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  )
}

export default CreateRecurringPaymentsSelector
