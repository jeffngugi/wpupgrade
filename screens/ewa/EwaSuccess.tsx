import React from 'react'
import { Box, Text, Pressable } from 'native-base'
import StatusAvatar from '../../components/status/StatusAvatar'
import StarIcon from '../../assets/svg/star.svg'
import {
  EwaRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
} from '../../types'
import { useMyProfile } from '~api/account'
import { useCreateBeneficiary } from '~api/ewa'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import SubmitButton from '~components/buttons/SubmitButton'
import { useSalaryAdvanceLoanSettings } from '~api/advance-loans'

interface Props {
  navigation: MainNavigationProp<EwaRoutes.EwaSuccess>
  route: MainNavigationRouteProp<EwaRoutes.EwaSuccess>
}

const EwaSuccess = ({ navigation, route }: Props) => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)
  const { data: advanceData, isLoading: settingLoading } =
    useSalaryAdvanceLoanSettings()
  const { mutate } = useCreateBeneficiary()
  const handleToEwaHome = () => {
    navigation.navigate(EwaRoutes.Ewa)
  }

  const settingsData = advanceData?.data?.settings?.data[0]

  const requireApproval =
    !!settingsData?.workpay_approval_required ||
    !!settingsData?.employer_approval_required
  const emp = useMyProfile()
  const currencyCode = emp?.data?.data?.currency_code ?? ''
  const currency_id = emp?.data?.data?.currency_id

  const data = route.params.formData
  const sentTo = data?.recipient_number ?? data?.phone ?? data?.accName

  const handleAddFavorite = () => {
    const beneficiaryData = {
      payment_method: data.payment_method.toLowerCase(),
      for_employee_id: employee_id,
      currency_id,
      selfservice: 1,
      ...(data.payment_method === 'BANK' && {
        name: data.accName,
        account_number: data.acc_no,
        bank_id: data.bank_id,
        branch_id: 1,
      }),
      ...(data.payment_method === 'MPESA' && {
        mobile: data.recipient_number,
        name: data.recipient_number,
      }),
    }
    mutate(beneficiaryData, {
      onSuccess: () => {
        handleToEwaHome()
      },
      onSettled: () => {
        navigation.navigate(EwaRoutes.Ewa)
      },
    })
  }
  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <Box alignItems="center" textAlign="center" marginTop="150px" flex={1}>
        <Box marginBottom="40px">
          <StatusAvatar width={0} borderd />
        </Box>
        <Text color="charcoal" fontSize="20px" fontFamily={'heading'}>
          {requireApproval
            ? 'EWA Request Successful'
            : 'Transaction successful'}
        </Text>
        {requireApproval ? (
          <Text
            fontSize="16px"
            marginY="8px"
            fontFamily={'heading'}
            textAlign="center">
            Your request is being processed. You will receive a notification
            once it has been approved.
          </Text>
        ) : (
          <Text
            fontSize="16px"
            marginY="8px"
            fontFamily={'heading'}
            textAlign="center">
            You have successful sent {currencyCode} {data.amount} to
            <Text fontSize="16px"> {sentTo}</Text>
          </Text>
        )}
      </Box>
      <Box>
        <Pressable
          borderWidth="1px"
          borderRadius="8px"
          borderColor="#78C3FB"
          backgroundColor="#CBE5F8"
          paddingLeft="18px"
          alignItems="center"
          flexDirection="row"
          paddingY="10px"
          marginBottom="32px"
          onPress={handleAddFavorite}>
          <Box
            rounded="full"
            backgroundColor="white"
            alignItems="center"
            justifyContent="center"
            padding="8px"
            marginRight="60px">
            <StarIcon color="#1C9CFC" />
          </Box>

          <Text color="navy.50" fontSize={'16px'}>
            Add as favorite
          </Text>
        </Pressable>
        <SubmitButton
          title="Go home"
          onPress={handleToEwaHome}
          loading={false}
        />
      </Box>
    </Box>
  )
}

export default EwaSuccess
