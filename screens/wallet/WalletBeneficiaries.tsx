import { ListRenderItem } from 'react-native'
import React, { useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import ScreenHeader from '~components/ScreenHeader'
import SearchInput from '~components/SearchInput'
import { useDeleteBeneficiary, useGetBeneficiaries } from '~api/wallet'
import LoaderScreen from '~components/LoaderScreen'
import { Box, FlatList } from 'native-base'
import ItemDivider from '~screens/account/components/ItemDivider'
import BeneficiaryItem from './components/BeneficiaryItem'
import { AppModules, TLinkedAccount } from '~types'
import EditLinkedAccountModal from '~components/modals/EditLinkedAccountModal'
import DeleteModal from '~components/modals/DeleteModal'
import { debounce } from 'lodash'
import EditDeleteModal from '~components/modals/EditDeleteModal'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import EmptyStateDynamic from '~components/empty-state/EmptyStateDynamic'
import CactusIcon from '~assets/svg/cactus.svg'

const WalletBeneficiaries = ({ navigation }) => {
  const [searchText, setSearchText] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [beneficiaryItem, setBeneficiaryItem] = useState<TLinkedAccount>()
  const { mutate, isLoading: deleting } = useDeleteBeneficiary()

  const beneficiaryParams = { searchText }
  const { data, isLoading } = useGetBeneficiaries(beneficiaryParams)
  const handleSearchBeneficiary = (name: string) => {
    debouncedSearch(name)
  }

  const renderItem: ListRenderItem<TLinkedAccount> = ({ index, item }) => {
    const handlePress = () => {
      setBeneficiaryItem(item)
      setIsOpen(true)
    }
    return (
      <BeneficiaryItem item={item} handlePress={handlePress} index={index} />
    )
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

  const debouncedSearch = React.useRef(
    debounce(text => {
      setSearchText(text)
    }, 1000),
  ).current

  const deleteBeneficiary = () => {
    const uuid = beneficiaryItem?.uuid as unknown as string
    mutate(uuid, {
      onSuccess: () => {
        queryClient.invalidateQueries(walletQKeys.recurring)
      },
      onSettled: () => {
        setDeleteModal(false)
      },
    })
  }
  if (isLoading) return <LoaderScreen />
  const hasSavedBeneficiaries = data?.data?.length > 0
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Saved beneficiaries"
        onPress={() => navigation.goBack()}
      />
      <Box my="12px" />
      <SearchInput
        handleSearch={handleSearchBeneficiary}
        placeholder="Search beneficiaries"
      />
      {hasSavedBeneficiaries ? (
        <FlatList
          mt="20px"
          flex={1}
          renderItem={renderItem}
          data={data?.data ?? []}
          ItemSeparatorComponent={ItemDivider}
        />
      ) : (
        <Box flex={1} alignItems="center" justifyContent="center">
          <EmptyStateDynamic
            moduleName={AppModules.walletTransactions}
            title={'You have no saved Benefitiaries  yet'}
            subTitle="Your saved beneficiaries will appear here"
            Icon={CactusIcon}
          />
        </Box>
      )}
      <EditLinkedAccountModal
        isOpen={editModal}
        hideModal={hideModals}
        item={beneficiaryItem}
      />
      <DeleteModal
        title="Delete linked account"
        description="Are you sure you want to remove linked account?"
        onDelete={deleteBeneficiary}
        isVisible={deleteModal}
        hideModal={() => setDeleteModal(false)}
        closeIcon
        loading={deleting}
      />
      <EditDeleteModal
        isOpen={isOpen}
        hideModal={() => setIsOpen(false)}
        handleEdit={openEditModal}
        handleDelete={openDeleteModal}
      />
    </ScreenContainer>
  )
}

export default WalletBeneficiaries
