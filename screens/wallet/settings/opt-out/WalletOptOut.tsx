import React, { useEffect, useState } from 'react'
import ScreenContainer from '~components/ScreenContainer'
import OptOutHeader from './OptOutHeader'
import OptOutInfo from './OptOutInfo'
import {
  Text,
  ScrollView,
  Button,
  Heading,
  HStack,
  Checkbox,
  Box,
} from 'native-base'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'

import OptInImg from '~assets/svg/optin-success.svg'
import { useGetOptOutReasons, useOptOutWallet } from '~api/wallet'
import { createSelectOptions } from '~helpers'
import WalletCommonModal from '~screens/wallet/components/modals/WalletCommonModal'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import LoadingModal from '~components/modals/LoadingModal'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'

const WalletOptOut = ({ navigation }) => {
  const { control, handleSubmit, setValue } = useForm()

  const [termsAccepted, setTermsAccepted] = useState(false)
  const { user_uuid, isActive } = useWalletStatus()
  const [visible, setVisible] = useState(false)
  const { mutate, isLoading } = useOptOutWallet()
  const { data: optOutReasons } = useGetOptOutReasons()

  useEffect(() => {
    if (!isActive) {
      navigation.navigate('HomeTabNavigator', {
        screen: 'Wallet',
      })
    }
  }, [isActive])

  const optOutOptions = createSelectOptions(
    optOutReasons?.data ?? [],
    'uuid',
    'name',
  )

  const onSubmit = data => {
    mutate(
      {
        ...data,
        reason_id: data.reason,
        password: data.password,
        uuid: user_uuid,
      },
      {
        onSuccess: () => {
          setVisible(true)
          queryClient.invalidateQueries([walletQKeys.user])
        },
      },
    )
  }
  return (
    <ScreenContainer>
      <OptOutHeader />
      <ScrollView flex={1}>
        <OptOutInfo />
        <Heading fontSize="18px" mt="24px" mb="15px">
          Before you go, Kindly tell us why you want to opt out
        </Heading>
        {/* <Text color="charcoal" mt="10px" mb="5px" fontSize="16px">
          Reason for opting out
        </Text> */}

        <DropdownInputV2
          items={optOutOptions}
          control={control}
          setValue={value => setValue('reason', value)}
          name="reason"
          label="Reason for opting out"
        />
        <Heading fontSize="20px" mt="22px" mb="14px">
          Confirm Password
        </Heading>
        <CommonInput
          label="Workpay password"
          name={'password'}
          control={control}
          placeholder=""
          rules={{
            required: { value: true, message: 'Password is required' },
          }}
        />
        <HStack space={6} my="16px">
          <Checkbox
            onChange={isSelected => setTermsAccepted(isSelected)}
            shadow={2}
            value="terms"
            colorScheme="green">
            <Text fontSize="14px" color="grey" width={'85%'}>
              {' '}
              I understand that all of my transaction history and files will be
              lost
            </Text>
          </Checkbox>
        </HStack>
        <Box height="20px" />
      </ScrollView>
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={!termsAccepted}
        backgroundColor={termsAccepted ? 'red.50' : 'red.40'}
        _text={
          termsAccepted
            ? {
                color: 'white',
                fontSize: '16px',
              }
            : {
                color: 'white',
                fontSize: '16px',
              }
        }
        _pressed={{
          opacity: 0.6,
          backgroundColor: 'red.50',
        }}>
        Opt out of Wallet
      </Button>
      <LoadingModal isVisible={isLoading} message="Opting out of wallet..." />
      <WalletCommonModal visible={visible} setVisible={setVisible}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Box my="15px">
            <OptInImg />
          </Box>
          <Heading color="white" fontSize="24px" textAlign="center">
            You've opted out of wallet
          </Heading>
        </Box>

        <Button
          backgroundColor="#387E1B"
          onPress={() => setVisible(false)}
          _text={{
            color: 'white',
            fontSize: '16px',
          }}>
          Done
        </Button>
      </WalletCommonModal>
    </ScreenContainer>
  )
}

export default WalletOptOut
