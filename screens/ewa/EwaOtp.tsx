import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Box, HStack, Text, Button, useToast } from 'native-base'
import ScreenHeader from '~components/ScreenHeader'
import size from 'lodash/size'
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import {
  EwaRoutes,
  MainNavigationProp,
  MainNavigationRouteProp,
  TResendOtp,
} from '~types'
import { useCompleteEwaWithdrawal, useConfirmOtp, useResendOtp } from '~api/ewa'
import { State } from '~declarations'
import { useSelector } from 'react-redux'
import { useFetchProfile } from '~api/home'
import SubmitButton from '~components/buttons/SubmitButton'

interface Props {
  navigation: MainNavigationProp<EwaRoutes.EwaOTP>
  route: MainNavigationRouteProp<EwaRoutes.EwaOTP>
}

const EwaOtp = ({ navigation, route }: Props) => {
  const { data: profileData } = useFetchProfile()
  const { mutate: mutateResend, isLoading: isResending } = useResendOtp()
  const { mutate: mutateConfirmOtp, isLoading: confirmingOtp } = useConfirmOtp()
  const { mutate: mutateCompleteWithdrawal, isLoading: isCompleting } =
    useCompleteEwaWithdrawal()
  const { cacheId, newSubmitData, ewaId } = route.params
  const CELL_COUNT = 4
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })
  const {
    user: { company_id, employee_id },
  } = useSelector((state: State) => state.user)
  const toast = useToast()
  const handleResend = () => {
    const resendData: TResendOtp = {
      cacheId,
      amount: newSubmitData.amount,
      recipient_item_id: ewaId,
    }
    mutateResend(resendData, {
      onSuccess: () => {
        toast.show({
          render: () => {
            return (
              <Box
                bg="navy.50"
                borderRadius="5px"
                mb="126px"
                py="14px"
                flex={1}
                paddingLeft="16px"
                paddingRight="140px">
                <Text fontSize={'14px'} color="white">
                  OTP code has been resent
                </Text>
              </Box>
            )
          },
        })
      },
    })
  }

  const handleConfirmWithdrawal = () => {
    const completeData = {
      payment_cache_id: cacheId,
      advance_id: ewaId,
      auth_company_id: company_id,
      selfservice: true,
      employee_id,
    }
    mutateCompleteWithdrawal(completeData, {
      onSuccess: () => {
        navigation.navigate(EwaRoutes.EwaSuccess, {
          formData: newSubmitData,
        })
      },
    })
  }

  const handleConfirmOtp = () => {
    const payload = {
      payment_cache_id: cacheId,
      pin: value,
      auth_company_id: company_id,
      selfservice: true,
      employee_id,
    }

    mutateConfirmOtp(payload, {
      onSuccess: () => {
        handleConfirmWithdrawal()
      },
    })
  }

  useEffect(() => {
    if (size(value) > 3) {
      handleConfirmOtp()
    }
  }, [value])

  const trimmedUserPhone = React.useMemo(
    () => profileData?.data?.mobile_no?.slice(0, -4),
    [profileData],
  )

  return (
    <Box flex={1} safeArea backgroundColor="white" paddingX="16px">
      <ScreenHeader
        title="Enter your OTP"
        onPress={() => navigation.goBack()}
      />
      <Text alignSelf="center">
        Enter the 4 digit OTP. The code was sent to
      </Text>
      <Text alignSelf="center"> {trimmedUserPhone}* ***</Text>
      <Box flex={1}>
        <Box paddingX="42px" marginY="30px">
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  { borderColor: index < value.length ? '#62A446' : '#BBBFC4' },
                  isFocused && styles.focusCell,
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || null}
              </Text>
            )}
          />
        </Box>
        <HStack alignSelf="center" alignItems="center">
          <Text>Didn’t receive a code?</Text>
          <Button variant="url" onPress={handleResend}>
            <Text color="green.50">Resend</Text>
          </Button>
        </HStack>
      </Box>
      <SubmitButton
        loading={isCompleting || isResending || confirmingOtp}
        disabled={size(value) < CELL_COUNT}
        title="Confirm"
        onPress={handleConfirmWithdrawal}
      />
    </Box>
  )
}

export default EwaOtp

const styles = StyleSheet.create({
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 54,
    height: 54,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
  },
  focusCell: {
    borderColor: '#62A446',
  },
})
