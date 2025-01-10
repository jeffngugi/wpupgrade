import { KeyboardTypeOptions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Control, Controller, RegisterOptions } from 'react-hook-form'
import { Box, FormControl, Input, Text } from 'native-base'

type CommonInputTypes = {
  label: string
  placeholder?: string
  required?: boolean
  keyboardType?: KeyboardTypeOptions
  name: string
  control: Control
  secure?: boolean
  width?: string
  my?: string
  rules?: RegisterOptions
  password?: boolean
}

const WalletAmountInput = ({
  label,
  keyboardType,
  name,
  control,
  rules,
  ...rest
}: CommonInputTypes) => {
  const inputRef = useRef(null)

  useEffect(() => {
    // Delay the focus to ensure it works correctly
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100) // 100 milliseconds delay

    // Cleanup the timer
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box {...rest} alignItems="center">
      <Controller
        control={control}
        name={name}
        rules={{ ...rules }}
        defaultValue=""
        render={({
          field: { onChange, onBlur, value },
          formState: { errors },
        }) => (
          <>
            <FormControl isInvalid={name in errors}>
              <FormControl.Label>
                <Box flex={1}>
                  <Text
                    fontFamily={'body'}
                    fontSize={'14px'}
                    color={'grey'}
                    alignSelf="center">
                    {label}
                  </Text>
                </Box>
              </FormControl.Label>
              <Input
                onBlur={onBlur}
                onChangeText={val => onChange(val)}
                value={value}
                keyboardType={keyboardType ?? 'default'}
                alignItems="center"
                placeholder="Ksh 0"
                borderRadius={0}
                fontSize="40px"
                lineHeight="48px"
                alignSelf="center"
                borderWidth={0}
                height="55px"
                textAlign="center"
                fontFamily="title"
                // fontFamily="mono"
                marginTop="8px"
                fontWeight="bold"
                ref={inputRef}
              />
              <FormControl.ErrorMessage alignItems="center">
                <Text
                  mr="auto"
                  ml="auto"
                  fontFamily={'body'}
                  fontSize={'13px'}
                  color="red.50"
                  textAlign="center">
                  {errors[name]?.message ?? 'This field is required'}
                </Text>
              </FormControl.ErrorMessage>
            </FormControl>
          </>
        )}
      />
    </Box>
  )
}

export default WalletAmountInput
