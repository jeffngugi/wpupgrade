import { ListRenderItem } from 'react-native'
import React from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import { Box, FlatList, Heading, HStack, Pressable, Text } from 'native-base'
import SearchInput from '~components/SearchInput'
import LipaBeneficiaryItem from '../LipaBeneficiaryItem'
import X from '~assets/svg/x.svg'
import { useGetBeneficiaries } from '~api/wallet'
import { useDebouncedSearch } from '~hooks/useDebouncedSearch'
import { WMerchantType } from '~types'

export type TMerchant = {
  acc_name: string
  acc_no: string
  bank: null
  channel: WMerchantType
  merchant_number: string
  name: string
  type: string
  uuid: string
}

type Props = {
  hideModal: () => void
  //   handleSearch: (text: string) => void
  open: boolean
  handlePressCard: (item: TMerchant) => void
  channel: WMerchantType
}

const MerchantModal = (p: Props) => {
  const [searchText, handleSearch] = useDebouncedSearch('', 500)
  const merchantParams: { channel: WMerchantType; searchText: string } = {
    searchText,
    channel: p.channel,
  }
  const { data, isLoading } = useGetBeneficiaries(merchantParams)

  const beneficiariesArr = data?.data

  const renderItem: ListRenderItem<TMerchant> = ({ item, index }) => {
    const accNumber = item?.merchant_number
    const accName = item?.acc_name ?? item.merchant_number
    return (
      <LipaBeneficiaryItem
        onPress={() => p.handlePressCard(item)}
        name={accName}
        accNo={accNumber}
        AbrevTxt="WP"
        idx={index}
      />
    )
  }
  return (
    <SwipableModal
      isOpen={p.open}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box paddingX="16px" paddingBottom="30px" minHeight={'30%'}>
        <HStack alignItems="center" marginBottom="10px">
          <Box flex={1}>
            <Heading mx={'auto'}>Saved Merchant</Heading>
          </Box>
          <Pressable ml="auto" onPress={p.hideModal}>
            <X width={24} height={24} color="#253545" />
          </Pressable>
        </HStack>
        <SearchInput handleSearch={handleSearch} placeholder="Search" />
        <Box>
          {isLoading ? (
            <Box>
              <Text>Loading ...</Text>
            </Box>
          ) : (
            <FlatList
              renderItem={renderItem}
              data={beneficiariesArr ?? []}
              marginY={'18px'}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          )}
        </Box>
      </Box>
    </SwipableModal>
  )
}

export default MerchantModal
