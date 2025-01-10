import React, { useEffect, useState } from 'react'
import SwipableModal from '~components/modals/SwipableModal'
import { Box, FlatList, HStack, Pressable, Spinner, Text } from 'native-base'
import BottomChev from '~assets/svg/chev-down.svg'
import { windowHeight } from '~utils/appConstants'
import { useGetBeneficiaries } from '~api/wallet'
import { useDebouncedSearch } from '~hooks/useDebouncedSearch'
import { ListRenderItem } from 'react-native'
import { AppModules, TLinkedAccount } from '~types'
import BeneficiaryItem from '../BeneficiaryItem'
import ItemDivider from '~screens/account/components/ItemDivider'
import CactusIcon from '~assets/svg/cactus.svg'
import EmptyStateDynamic from '~components/empty-state/EmptyStateDynamic'

type Props = {
  isOpen: boolean
  hideModal: () => void
  handleSearchBeneficiary: (search: string) => void
  setBeneficiaryItem?: (item: TLinkedAccount) => void
  channel?: 'WALLET' | 'BANK' | 'MPESA'
}

interface BeneficiaryParams {
  searchText: string
  channel?: 'WALLET_TRANSFER' | 'BANK_TRANSFER' | 'MPESA'
}

const BeneficiaryModal = (p: Props) => {
  const [searchText, handleSearch] = useDebouncedSearch('', 500)
  const { channel } = p
  const beneficiaryParams: BeneficiaryParams = {
    searchText,
  }
  let benefitiaryModalChannelText = ''

  switch (channel) {
    case 'WALLET':
      beneficiaryParams['channel'] = 'WALLET_TRANSFER'
      benefitiaryModalChannelText = 'on wallets'
      break
    case 'BANK':
      beneficiaryParams['channel'] = 'BANK_TRANSFER'
      benefitiaryModalChannelText = 'on bank transfer'
      break
    case 'MPESA':
      beneficiaryParams['channel'] = 'MPESA'
      benefitiaryModalChannelText = 'on mpesa'
      break
    default:
      break
  }

  const { data, isLoading } = useGetBeneficiaries(beneficiaryParams)

  //no filtering until search api is implemented
  const filteredBeneficiaries = data?.data ?? []

  const renderItem: ListRenderItem<TLinkedAccount> = ({ index, item }) => {
    const handlePress = () => {
      p.setBeneficiaryItem?.(item)
    }
    return (
      <BeneficiaryItem
        item={item}
        handlePress={handlePress}
        index={index}
        editable={false}
      />
    )
  }

  const hasBeneficiaries = data?.data?.length > 0

  return (
    <SwipableModal
      isOpen={p.isOpen}
      onHide={p.hideModal}
      onBackdropPress={p.hideModal}>
      <Box height={windowHeight * 0.7} px="16px">
        <HStack alignItems="center" mb="24px">
          <Pressable onPress={p.hideModal}>
            <BottomChev color="#253545" />
          </Pressable>
          <Text
            color="charcoal"
            fontSize="20px"
            lineHeight="20px"
            ml="68px"
            fontFamily={'heading'}>
            Saved Beneficiaries
          </Text>
        </HStack>
        {/* <SearchInput
          placeholder="Search beneficiary"
          handleSearch={handleSearchBeneficiary}
        /> */}
        {!isLoading ? (
          hasBeneficiaries ? (
            <FlatList
              mt="20px"
              flex={1}
              renderItem={renderItem}
              data={filteredBeneficiaries ?? []}
              ItemSeparatorComponent={ItemDivider}
            />
          ) : (
            <Box flex={1} alignItems="center" justifyContent="center">
              <EmptyStateDynamic
                moduleName={AppModules.walletTransactions}
                title={`You have no beneficiaries saved ${
                  benefitiaryModalChannelText ?? ''
                } yet`}
                subTitle="Your saved beneficiaries will appear here"
                Icon={CactusIcon}
              />
            </Box>
          )
        ) : (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Spinner color="green.500" size={'sm'} marginRight="15px" />
          </Box>
        )}
      </Box>
    </SwipableModal>
  )
}

export default BeneficiaryModal
