import React from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import NoRecurring from './NoRecurring'
import { Button, Box, FlatList } from 'native-base'
import RecurringPaymentItem from './components/RecurringPaymentItem'
import { useGetWalletRecurring } from '~api/wallet'
import LoaderScreen from '~components/LoaderScreen'
import { isEmpty } from 'lodash'
import { ListRenderItem } from 'react-native'
import { IRecurringPayment } from './types'
import ItemDivider from '~screens/account/components/ItemDivider'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.RecurringPayment>
  route: MainNavigationRouteProp<WalletRoutes.RecurringPayment>
}

const RecurringPayments = ({ navigation }: Props) => {
  const { data, isLoading } = useGetWalletRecurring()

  const recurringPayments = data?.data ?? []

  const renderItem: ListRenderItem<IRecurringPayment> = ({ index, item }) => {
    const handlePress = () => {
      navigation.navigate(WalletRoutes.RecurringDetails, { item })
    }
    return (
      <RecurringPaymentItem
        item={item}
        handlePress={handlePress}
        index={index}
      />
    )
  }

  if (isLoading) return <LoaderScreen />
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Recurring Payments"
        onPress={() => navigation.goBack()}
      />
      <Box flex={1} paddingTop="10px">
        {!isEmpty(recurringPayments) ? (
          <FlatList
            data={recurringPayments}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemDivider}
          />
        ) : (
          <NoRecurring />
        )}
      </Box>

      <Button
        onPress={() =>
          navigation.navigate(WalletRoutes.CreateRecurringPayment)
        }>
        Create recurring payments
      </Button>
    </ScreenContainer>
  )
}

export default RecurringPayments
