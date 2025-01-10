import { ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { Box, FlatList } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import ItemDivider from '~screens/account/components/ItemDivider'
import TransactionCategoryListItem, {
  TransactionCategoryItem,
} from './components/TransactionListItem'
import TransactionCategoryModal from '~screens/wallet/settings/transaction-categories/components/TransactionCategoryModal'
import FloatingBtn from '~components/FloatingBtn'
import { WalletRoutes } from '~types'
import {
  useDeleteTransactionCategory,
  useGetWalletUser,
  useTransactionCategories,
} from '~api/wallet'
import LoadingModal from '~components/modals/LoadingModal'
import LoaderScreen from '~components/LoaderScreen'

type Props = {
  navigation: any
}

const WalletTranscationCategories = ({ navigation }: Props) => {
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedCategory, setSelectedCategory] =
    React.useState<TransactionCategoryItem | null>(null)
  const { data: walletData } = useGetWalletUser()
  const uuid = walletData.data.uuid

  const { mutate, isLoading } = useDeleteTransactionCategory()

  const categoriesQuery = useTransactionCategories({ user_uuid: uuid })
  const categoriesData = categoriesQuery.data?.data || []

  const renderItem: ListRenderItem<TransactionCategoryItem> = ({ item }) => {
    const handlePress = (type: string) => {
      if (type === 'edit') {
        setOpenModal(true)
        setSelectedCategory(item)
      } else if (type === 'delete') {
        // delete category
        if (item.uuid) mutate(item.uuid)
      }
    }
    return <TransactionCategoryListItem handlePress={handlePress} item={item} />
  }

  if (categoriesQuery.isLoading) {
    return <LoaderScreen />
  }

  return (
    <Box safeArea px="16px" backgroundColor="white" flex={1}>
      <ScreenHeader
        title="Transaction Categories"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        mt="20px"
        // flex={1}
        renderItem={renderItem}
        data={categoriesData}
        ItemSeparatorComponent={ItemDivider}
      />
      <Box>
        <FloatingBtn
          onPress={() =>
            navigation.navigate(WalletRoutes.AddWalletTransactionCategory)
          }
        />
      </Box>
      <LoadingModal
        isVisible={isLoading}
        message="Deleting transaction category..."
      />
      <TransactionCategoryModal
        isOpen={openModal}
        hideModal={() => setOpenModal(false)}
        categoryData={selectedCategory || {}}
      />
    </Box>
  )
}

export default WalletTranscationCategories

const styles = StyleSheet.create({})
