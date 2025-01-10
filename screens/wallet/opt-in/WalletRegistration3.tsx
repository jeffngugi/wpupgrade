import React, { useState } from 'react'
import { Box, Button, Heading, Progress, ScrollView, Text } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import { useForm } from 'react-hook-form'
import CommonInput from '~components/inputs/CommonInput'
import WalletCommonModal from '../components/modals/WalletCommonModal'
import OptInImg from '~assets/svg/optin-success.svg'
import { useCreateWalletPin, useGetWalletUser } from '~api/wallet'
import { queryClient } from '~ClientApp'
import { walletQKeys } from '~api/QueryKeys'
import SubmitButton from '~components/buttons/SubmitButton'

const WalletRegistration3 = ({ navigation }) => {
  const { handleSubmit, control, setError } = useForm()
  const [visible, setVisible] = useState(false)
  const { isLoading, mutate } = useCreateWalletPin()
  const { data: userData } = useGetWalletUser()

  const onSubmit = (data: { confirm_pin: string; password: string }) => {
    // setVisible(true)
    if (data.password !== data.confirm_pin) {
      setError('confirm_pin', {
        type: 'manual',
        message: 'PIN mis-match',
      })
      return
    }
    // const
    const submitData = {
      uuid: userData.data.uuid,
      password: data.password,
    }

    mutate(submitData, {
      onSuccess: data => {
        queryClient.invalidateQueries(walletQKeys.user)
        setVisible(true)
      },
    })
  }

  const handleContinue = () => {
    navigation.navigate('Wallet')
    setVisible(false)
  }

  return (
    <Box flex={1} safeArea backgroundColor="white">
      <Box paddingX="16px" mb="18px">
        <ScreenHeader
          title="Create your PIN"
          onPress={() => navigation.goBack()}
        />
      </Box>
      <Progress
        value={100}
        _filledTrack={{
          bg: 'green.40',
        }}
      />
      <Box paddingX="16px" flex={1}>
        <ScrollView flex={1}>
          <Text fontSize="16px" my="10px" color="charcoal">
            Create a secure PIN for your wallet
          </Text>
          <CommonInput
            label="Your wallet pin"
            name={'password'}
            control={control}
            placeholder="Enter pin"
            rules={{
              required: { value: true, message: 'Confirm PIN' },
              validate: {
                length: value =>
                  value.length === 4 || 'PIN must be 4 characters',
                numbersOnly: value =>
                  /^\d+$/.test(value) || 'PIN must be numeric',
              },
            }}
            password
          />
          <CommonInput
            my="20px"
            label="Confirm Pin"
            name={'confirm_pin'}
            control={control}
            placeholder="Enter pin"
            rules={{
              required: { value: true, message: 'Confirm PIN' },
              validate: {
                length: value =>
                  value.length === 4 || 'PIN must be 4 characters',
                numbersOnly: value =>
                  /^\d+$/.test(value) || 'PIN must be numeric',
              },
            }}
            password
          />
        </ScrollView>

        <SubmitButton
          onPress={handleSubmit(onSubmit)}
          title="Continue"
          loading={isLoading}
        />

        <WalletCommonModal visible={visible} setVisible={setVisible}>
          <Box flex={1} alignItems="center" justifyContent="center">
            <Box my="15px">
              <OptInImg />
            </Box>
            <Heading color="white" fontSize="32px" textAlign="center">
              You have successfully {'\n'} opted in to Wallets
            </Heading>
          </Box>

          <SubmitButton
            onPress={handleContinue}
            title="Continue"
            loading={isLoading}
          />
        </WalletCommonModal>
      </Box>
    </Box>
  )
}

export default WalletRegistration3
