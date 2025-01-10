import { ListRenderItem } from 'react-native'
import React, { useState } from 'react'
import { Box, FlatList } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { TLinkedAccount, WalletRoutes } from '~types'
import LinkedAccountItem from './components/LinkedAccountItem'
import FloatingBtn from '~components/FloatingBtn'
import ScreenContainer from '~components/ScreenContainer'
import EditDeleteModal from '~components/modals/EditDeleteModal'
import DeleteModal from '~components/modals/DeleteModal'
import ItemDivider from '~screens/account/components/ItemDivider'
import EditLinkedAccountModal from '~components/modals/EditLinkedAccountModal'
import { useDeleteBeneficiary, useGetLinkedAccounts } from '~api/wallet'
import LoaderScreen from '~components/LoaderScreen'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'

const LinkedAccounts = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const { data, isLoading } = useGetLinkedAccounts()
  const [beneficiaryItem, setBeneficiaryItem] = useState<TLinkedAccount>()
  const { mutate, isLoading: deleting } = useDeleteBeneficiary()

  const deleteLinkedAccount = () => {
    const uuid = beneficiaryItem?.uuid as unknown as string
    mutate(uuid, {
      onSuccess: () => {
        queryClient.invalidateQueries(walletQKeys.recurring)
        queryClient.invalidateQueries(walletQKeys.linkedAcc)
      },
      onSettled: () => {
        setDeleteModal(false)
      },
    })
  }
  const renderItem: ListRenderItem<TLinkedAccount> = ({ item }) => {
    const handlePress = () => {
      setBeneficiaryItem(item)
      setIsOpen(true)
    }

    return <LinkedAccountItem item={item} handlePress={handlePress} />
  }

  const hideModals = () => {
    setEditModal(false)
    setIsOpen(false)
    setDeleteModal(false)
  }

  const openDeleteModal = () => {
    setIsOpen(false)
    setEditModal(false)
    setTimeout(() => setDeleteModal(true), 500)
  }

  const openEditModal = () => {
    setIsOpen(false)
    setDeleteModal(false)
    setTimeout(() => setEditModal(true), 400)
  }

  const hasBank = data?.data.find(data => data?.channel === 'BANK_TRANSFER')
  const hasMobile = data?.data.find(data => data?.channel !== 'BANK_TRANSFER')

  if (isLoading) return <LoaderScreen />

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Linked Accounts"
        onPress={() => navigation.goBack()}
      />
      <Box flex={1}>
        <FlatList
          mt="20px"
          flex={1}
          renderItem={renderItem}
          data={data?.data ?? []}
          ItemSeparatorComponent={ItemDivider}
        />
        {!!hasBank && !!hasMobile ? null : (
          <FloatingBtn
            onPress={() => navigation.navigate(WalletRoutes.LinkAccount)}
          />
        )}
      </Box>
      <EditDeleteModal
        isOpen={isOpen}
        hideModal={() => setIsOpen(false)}
        handleEdit={openEditModal}
        handleDelete={openDeleteModal}
      />
      <EditLinkedAccountModal
        isOpen={editModal}
        hideModal={hideModals}
        item={beneficiaryItem}
        isAccOwner
      />
      <DeleteModal
        title="Delete linked account"
        description="Are you sure you want to remove linked account?"
        onDelete={deleteLinkedAccount}
        isVisible={deleteModal}
        hideModal={() => setDeleteModal(false)}
        closeIcon
        loading={deleting}
      />
    </ScreenContainer>
  )
}

export default LinkedAccounts
