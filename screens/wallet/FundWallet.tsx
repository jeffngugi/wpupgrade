import React, { useEffect, useState } from 'react'
import ScreenHeader from '~components/ScreenHeader'
import {
  Box,
  FlatList,
  Text,
  Divider,
  Pressable,
  ScrollView,
  Button,
} from 'native-base'
import WalletAmountInput from './components/WalletAmountInput'
import { useForm } from 'react-hook-form'
import CustomRadio from './components/CustomRadio'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  WalletRoutes,
} from '~types'
import { FundSourceType, useFundSourceData } from './data/useWalletData'
import WalletListBox from './components/WalletListBox'
import { isNull } from 'lodash'
import { useFundWallet, useGetWalletUser } from '~api/wallet'
import SubmitButton from '~components/buttons/SubmitButton'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.FundWallet>
  route: MainNavigationRouteProp<WalletRoutes.FundWallet>
}

const FundWallet = ({ navigation }: Props) => {
  const { control, handleSubmit } = useForm()
  const { fundSource } = useFundSourceData()
  const { data } = useGetWalletUser()
  const { mutate, isLoading } = useFundWallet()
  const wallet = data.data.wallets[0]
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const handlePress = ({
    index,
    item,
  }: {
    index: number
    item: FundSourceType
  }) => {
    setActiveIndex(index)
  }

  const onSubmit = data => {
    if (activeIndex === null) {
      return
    }
    const amount = data.amount
    const source = fundSource[activeIndex]

    if (source.sourceId === 'Card') {
      const walletData = {
        wallet_id: wallet.uuid,
        amount,
        payment_method: 'CARD',
      }
      mutate(walletData, {
        onSuccess: data => {
          navigation.navigate(WalletRoutes.FundWalletForm, {
            fundSource: source,
            amount,
            reference: data?.data?.reference,
          })
        },
      })
      return
    }

    navigation.navigate(WalletRoutes.FundWalletForm, {
      fundSource: source,
      amount,
    })
  }

  const renderItem = (item: FundSourceType, index: number) => {
    const { Icon, source, description } = item

    return (
      <Pressable
        flexDirection="row"
        marginX="20px"
        alignItems="center"
        marginY="20px"
        onPress={() => handlePress({ index, item })}>
        <Icon color="#003049" />
        <Box ml="20px" width="70%" mr="auto">
          <Text lineHeight="24px" fontSize="16px" color="charcoal">
            {source}
          </Text>
          <Text>{description}</Text>
        </Box>
        <CustomRadio selected={activeIndex === index} />
      </Pressable>
    )
  }
  return (
    <Box backgroundColor="white" flex={1} safeArea px="16px">
      <ScreenHeader onPress={() => navigation.goBack()} title="Fund wallet" />
      <ScrollView flex={1}>
        <WalletAmountInput
          control={control}
          label="Amount to Top-up"
          name="amount"
          placeholder="Ksh 0"
          rules={{
            required: { value: true, message: 'Amount is required' },
          }}
          keyboardType="numeric"
        />

        <Text
          fontSize="16px"
          lineHeight="24px"
          mt="56px"
          color="charcoal"
          fontFamily="heading"
          mb="12px">
          Select your fund source
        </Text>
        <WalletListBox>
          <FlatList
            data={fundSource}
            renderItem={({ item, index }) => renderItem(item, index)}
            ItemSeparatorComponent={() => <Divider borderColor="red.200" />}
          />
        </WalletListBox>
      </ScrollView>

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        disabled={isNull(activeIndex)}
        title="Continue"
        loading={isLoading}
      />
    </Box>
  )
}

export default FundWallet
