import React from 'react'
import { Box, HStack, Heading, Pressable, Text } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import PlusIcon from '~assets/svg/plus.svg'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { WalletRoutes } from '~types'
import { useGetWalletUser } from '~api/wallet'
import { currencyWithCode } from '~utils/appUtils'
import { Dimensions } from 'react-native'
import Eye from '~assets/svg/eye.svg'
import EyeOff from '~assets/svg/eye-off.svg'
import { hiddenAmount } from '~utils/app-utils'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '~declarations'
import { setShowAmount } from '~store/actions/Application'

const DeviceWidth = Dimensions.get('window').width
const cardWidth = DeviceWidth - 40

const WalletScrollItem = () => {
  const navigation = useNavigation()
  const { data: walletData, refetch } = useGetWalletUser()
  const {
    application: { showAmount: show },
  } = useSelector((state: State) => state)

  const dispatch = useDispatch()

  const onToggleAmount = () => dispatch(setShowAmount(!show))

  useFocusEffect(
    React.useCallback(() => {
      refetch()
    }, []),
  )

  const walletBalance = walletData?.data?.wallets[0]?.balance ?? 0
  const walletCurrency = walletData?.data?.wallets[0]?.currency ?? ''

  const formattedAmount = currencyWithCode(walletCurrency, walletBalance)

  return (
    <Box flex={1} alignItems={'center'}>
      <Box
        borderWidth="3px"
        borderRadius="6px"
        borderColor="white"
        shadow="5"
        width={cardWidth}
        height={'168px'}>
        <LinearGradient
          colors={['#D6F1CA' || '#F2F3F3', '#F1FDEB' || '#EEF5EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Box margin="20px" height={'122px'}>
            <HStack>
              <Text fontSize="16px">Wallet Balance</Text>
              <Pressable onPress={onToggleAmount} paddingX="10px">
                {show ? (
                  <Eye color="#536171" width={18} />
                ) : (
                  <EyeOff color="#536171" width={18} />
                )}
              </Pressable>
            </HStack>
            <Heading fontSize="24px" mt="9px">
              {show ? formattedAmount : hiddenAmount(formattedAmount)}
            </Heading>
            <Pressable
              flexDirection="row"
              backgroundColor="green.50"
              width="55%"
              alignItems="center"
              paddingY="10px"
              mt={'20px'}
              borderRadius="4px"
              justifyContent="center"
              onPress={() => navigation.navigate(WalletRoutes.FundWallet)}>
              <PlusIcon color="#ffffff" />

              <Text fontSize="16px" color="white" ml={'2px'}>
                Fund Wallet
              </Text>
            </Pressable>
          </Box>
        </LinearGradient>
      </Box>
    </Box>
  )
}

export default WalletScrollItem
