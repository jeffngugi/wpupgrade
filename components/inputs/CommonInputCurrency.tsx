import { KeyboardTypeOptions } from 'react-native'
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import {
  Box,
  FormControl,
  IInputProps,
  Input,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import ChevronDownIcon from '~assets/svg/caret-down-1.svg'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import CountryPicker from 'react-native-country-picker-modal'

type CommonInputTypes<T extends FieldValues = FieldValues, U = any> = {
  label: string
  placeholder?: string
  required?: boolean
  keyboardType?: KeyboardTypeOptions
  name: Path<T>
  control: Control<T, U>
  secure?: boolean
  width?: string
  my?: string
  rules?: RegisterOptions
  password?: boolean
  inputProps?: IInputProps; // Native Base input props
  show?: () => void
  currencyItem?: any
  currencyData?: any
  disableCurrency?: boolean
  setValue: any
  showCountryPicker: boolean
  open?: boolean
  currencies?: any
  setShowCountryPicker: Dispatch<SetStateAction<boolean>>
} & IInputProps;


const CommonInputCurrency = <T extends FieldValues = FieldValues, U = any>({
  label,
  placeholder,
  keyboardType,
  name,
  control,
  rules,
  secure,
  password,
  inputProps,
  currencyItem,
  currencyData,
  disableCurrency,
  setValue,
  showCountryPicker,
  open,
  currencies,
  setShowCountryPicker,
  ...rest
}: CommonInputTypes<T, U>) => {

  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [country, setCountry] = useState<Country>(null)

  useEffect(() => {
    if (currencyData) {
      setCountryCode(currencyData?.country_alpha_two_code)
      setValue('currency', currencyData?.value)

    }
  }, [currencyData])

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
    if (setValue && country?.currency?.[0]) {

      const currencyId = currencies?.find(
        (option: any) => {
          console.log(option.code, 'option.code', country.currency[0], 'country.currency[0]')
          return option.code === country.currency[0]
        }
      )?.id

      setValue?.('currency', currencyId)
    }
    setShowCountryPicker(false)
  }

  const InputCountryElement = () => (
    <Pressable
      disabled={disableCurrency}
      onPress={() => {
        if (!disableCurrency) {
          setShowCountryPicker(true)
        }

      }}
      px="8px" borderRightWidth={'1px'} borderColor="#BBBFC4" height="48px"
      justifyContent="center" alignItems="center" flexDirection="row">
      <CountryPicker
        {...{
          countryCode,
          withFilter: true,
          withAlphaFilter: true,
          visible: showCountryPicker,
          withCurrency: true,
          withCurrencyButton: true,
          // withFlag: true,
          onSelect,
          onClose: () => setShowCountryPicker(false),
        }}
      />

      {/* <Box ml="4px"> */}
      <ChevronDownIcon width={20} height={20} />
      {/* </Box> */}
    </Pressable >
  )

  return (
    <Box {...rest}>
      <Controller
        control={control}
        name={name}
        rules={{ ...rules }}
        // defaultValue={}
        render={({
          field: { onChange, onBlur, value },
          formState: { errors },
        }) => (
          <>
            <FormControl isInvalid={name in errors}>
              <FormControl.Label>
                <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                  {label}
                </Text>
              </FormControl.Label>

              <Input
                onBlur={onBlur}
                onChangeText={val => onChange(val)}
                _focus={{ borderColor: 'green.50' }}
                _invalid={{ borderColor: 'red.50' }}
                value={value}
                keyboardType={keyboardType ?? 'default'}
                backgroundColor={'transparent'} //This field is required
                placeholder={placeholder ?? ''}
                secureTextEntry={secure}
                InputLeftElement={<InputCountryElement />}

                fontFamily={'body'}
                fontSize="16px"
                placeholderTextColor={'red'}
                color={'charcoal'}
                height={'48px'}
                inValidOutlineColor={'red.50'}
                {...inputProps}
              />
              <FormControl.ErrorMessage>

                <Text fontFamily={'body'} fontSize={'14px'} color="red.50" lineHeight={'18px'}>
                  {errors[name]?.message as ReactNode ?? 'This field is required'}
                </Text>
                {/* <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                    {errors['currency']?.message as ReactNode}
                  </Text> */}
              </FormControl.ErrorMessage>
              <FormControl.ErrorMessage>
                <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                  {errors['currency']?.message as ReactNode}
                </Text>
              </FormControl.ErrorMessage>

            </FormControl>
          </>
        )}
      />
    </Box>
  )
}

export default CommonInputCurrency

