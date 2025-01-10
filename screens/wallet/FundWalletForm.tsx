import React from 'react'
import { Box, ScrollView } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import FundWalletBank from './components/FundWalletBank'
import FundWalletMpesa from './components/FundWalletMpesa'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import FundWalletCard from './components/FundWalletCard'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.FundWalletForm>
  route: MainNavigationRouteProp<WalletRoutes.FundWalletForm>
}

const FundWalletForm = ({ route, navigation }: Props) => {
  const { sourceId } = route.params.fundSource
  const amount = route.params.amount
  const reference = route.params.reference
  return (
    <Box backgroundColor="white" flex={1} safeArea px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Fund wallet" />
      <Box flex={1}>
        {sourceId === 'Bank' ? <FundWalletBank amount={amount} /> : null}
        {sourceId === 'Mobile' ? <FundWalletMpesa amount={amount} /> : null}
        {sourceId === 'Card' ? (
          <FundWalletCard amount={amount} reference={reference as string} />
        ) : null}
      </Box>
    </Box>
  )
}

export default FundWalletForm
