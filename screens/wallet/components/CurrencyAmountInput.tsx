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

const CurrencyAmountInput = ({
  label,
  keyboardType,
  name,
  control,
  rules,
  placeholder,
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

  const formatNumber = (value: string, currency = 'KES'): string => {
    const cleanValue = value.replace(/[^0-9.]/g, '')

    const parts = cleanValue.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const formattedNumber =
      decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger

    return `${currency} ${formattedNumber}`
  }

  const unformatNumber = (value: string, currency = 'KES'): string => {
    const regexPattern = new RegExp(`${currency}|,|\\s`, 'g')
    return value.replace(regexPattern, '')
  }

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
        }) => {
          const handleChangeText = (text: string) => {
            const cleanedText = text.replace(/[^0-9.,]/g, '')
            const decimalCount = cleanedText.split('.').length - 1
            if (decimalCount > 1) return
            const unformattedValue = unformatNumber(cleanedText)
            onChange(unformattedValue)
          }
          return (
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
                  multiline
                  onBlur={onBlur}
                  onChangeText={handleChangeText}
                  value={value ? formatNumber(value) : ''}
                  keyboardType={keyboardType ?? 'default'}
                  alignItems="center"
                  placeholder={placeholder ?? 'Ksh 0'}
                  borderRadius={0}
                  fontSize="38px"
                  lineHeight="48px"
                  alignSelf="center"
                  borderWidth={0}
                  height="55px"
                  textAlign="center"
                  fontFamily="title"
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
          )
        }}
      />
    </Box>
  )
}

export default CurrencyAmountInput
