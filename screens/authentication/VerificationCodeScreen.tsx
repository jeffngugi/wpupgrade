import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import { Box, Button, Heading, Pressable, Text } from 'native-base'
import AuthHeader from './AuthHeader'
import { AuthStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FormattedMessage } from 'react-intl'

type Props = NativeStackScreenProps<AuthStackParamList, 'VerificationCode'>

export default function VerificationCodeScreen({ navigation }: Props) {
  const CELL_COUNT = 4
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  const [countdown, setCountdown] = useState(60) // Initial countdown time in seconds
  const [canReset, setCanReset] = useState(false) // Indicates whether the reset password button can be clicked

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          setCanReset(true) // Enable the reset button after countdown finishes
          clearInterval(timer) // Stop the timer
          return 0 // Set countdown to 0
        }
        return prevCountdown - 1 // Decrease countdown by 1 second
      })
    }, 1000)

    return () => clearInterval(timer) // Cleanup function to clear the interval
  }, [])

  const handleBack = () => navigation.goBack()
  const handleToResetPassword = () => {
    navigation.navigate('ResetPassword', { code: value })
  }

  if (value.length === CELL_COUNT) {
    handleToResetPassword()
  }

  const handleResendCode = () => {
    setCountdown(60) // Reset countdown to initial value
    setCanReset(false) // Disable reset button again
    navigation.navigate('ForgotPassword')
  }

  return (
    <Box flex={1} safeArea paddingX={'16px'} background={'white'}>
      <Box marginTop="19px" />
      <AuthHeader onPress={handleBack} />
      <Heading
        marginTop={'24px'}
        mb={'12px'}
        fontSize="24px"
        color={'charcoal'}>
        <FormattedMessage id="login.code_title" />
      </Heading>
      <Text fontSize={'16px'} color={'grey'}>
        <FormattedMessage id="login.code_description" />
      </Text>

      <Box width={'3/5'} mt={'32px'}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          // rootStyle={styles.codeFieldRoot}
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
      <Box marginTop="24px">
        {!canReset ? (
          <Text color="grey" fontSize={'16px'} fontFamily={'heading'}>
            You can reset code in {countdown}
          </Text>
        ) : (
          <Pressable
            style={{ alignSelf: 'flex-start' }}
            paddingLeft="0"
            onPress={handleResendCode}
            marginTop="20px">
            <Text color="green.50" fontSize={'16px'} fontFamily={'heading'}>
              <FormattedMessage id="login.resend_code" />
            </Text>
          </Pressable>
        )}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 16,
    color: '#253545',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
  },
  focusCell: {
    borderColor: '#62A446',
  },
})
