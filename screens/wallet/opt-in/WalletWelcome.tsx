import React from 'react'
import {
  Box,
  HStack,
  Heading,
  Text,
  ScrollView,
  Button,
  Image,
} from 'native-base'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { WalletRoutes } from '~types'
import { useNavigation } from '@react-navigation/native'
import WalletIconn from '~assets/svg/wallet.svg'
import WalletBGIcon from '~assets/svg/wallet-card.svg'
import SmartPhoneIcon from '~assets/svg/smartphone3.svg'
import CashIcon from '~assets/svg/cash-1.svg'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import { useFetchProfile } from '~api/home'
import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const cardWidth = width

const WalletWelcome = () => {
  const navigation = useNavigation()
  useStatusBarBackgroundColor('white')
  const { data: myProfileData } = useFetchProfile()

  const fullName = myProfileData?.data?.full_names
  const handleGetStarted = () => {
    navigation.navigate(WalletRoutes.PersonalDetail)
  }
  const handleNotification = () => {
    navigation.navigate(WalletRoutes.Notifications)
  }
  return (
    <SafeAreaProvider>
      {/* <CustomStatusBar backgroundColor="#F1FDEB" /> */}
      <Box flex={1} pt={'50px'} backgroundColor="#F1FDEB">
        <ScrollView
          showsVerticalScrollIndicator={false}
          background={'white'}
          bounces={false}>
          <Box
            // width="100%"
            borderColor="green.50"
            // padding="16px"
            bg={{
              linearGradient: {
                colors: ['#F1FDEB', '#FFFFFF'],
                start: [0, 0],
                end: [0, 0.5],
              },
            }}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              px={'16px'}
              backgroundColor="red">
              <Heading fontSize="24px" color={'charcoal'}>
                Wallet
              </Heading>
              {/* <Pressable
                padding="4px"
                paddingRight="0"
                onPress={handleNotification}>
                <NotifIcon color="#253545" />
              </Pressable> */}
            </HStack>

            <Box alignItems={'center'}>
              <WalletBGIcon width={cardWidth} />

              <Text
                mb="20px"
                fontSize="16px"
                mt="16px"
                mr={'56px'}
                alignSelf={'flex-end'}
                position={'relative'}
                maxW={'180px'}
                top={'-215px'}>
                {fullName}
              </Text>
            </Box>
          </Box>
          <Box paddingX="16px" backgroundColor="white" mt={'-90px'}>
            <Heading>
              Simplify your finances with our digital wallet solution
            </Heading>
            <Text mb="20px" fontSize="16px" mt="16px">
              Simplify your finances with our digital wallet solution
            </Text>
            <HStack mt={'10px'} backgroundColor="white">
              <Box mr={'10px'}>
                <WalletIconn color={'green'} />
              </Box>
              <Box width={'80%'}>
                <Text
                  fontFamily={'heading'}
                  fontSize={'18px'}
                  mb={'5px'}
                  color={'charcoal'}>
                  Send and receive funds
                </Text>
                <Text fontSize={'16px'} color={'grey'}>
                  Financial Flexibility for employees just got easier with the
                  workpay wallet
                </Text>
              </Box>
            </HStack>
            <HStack mt={'30px'} backgroundColor="white">
              <Box mr={'10px'}>
                <CashIcon color={'green'} />
              </Box>
              <Box width={'80%'}>
                <Text
                  fontFamily={'heading'}
                  fontSize={'18px'}
                  mb={'5px'}
                  color={'charcoal'}>
                  Pay Bills
                </Text>
                <Text fontSize={'16px'} color={'grey'}>
                  Financial Flexibility for employees just got easier with the
                  workpay wallet
                </Text>
              </Box>
            </HStack>
            <HStack mt={'30px'} backgroundColor="white">
              <Box mr={'10px'}>
                <SmartPhoneIcon color={'green'} />
              </Box>
              <Box width={'80%'}>
                <Text
                  fontFamily={'heading'}
                  fontSize={'18px'}
                  mb={'5px'}
                  color={'charcoal'}>
                  Easily access funds on the move
                </Text>
                <Text fontSize={'16px'} color={'grey'}>
                  Financial Flexibility for employees just got easier with the
                  workpay wallet
                </Text>
              </Box>
            </HStack>
          </Box>
          <Box height={'100px'}> </Box>
        </ScrollView>
        <Box
          position={'absolute'}
          bottom={'0px'}
          width={'100%'}
          paddingBottom={'20px'}
          background={'white'}>
          <Button
            onPress={handleGetStarted}
            height="50px"
            mx={'16px'}
            width={'90%'}
            _text={{ fontFamily: 'heading', fontSize: '16px' }}>
            Get Started
          </Button>
        </Box>
      </Box>
    </SafeAreaProvider>
  )
}

export default WalletWelcome
