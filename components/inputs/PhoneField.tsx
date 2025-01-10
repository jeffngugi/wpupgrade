import React, { useEffect } from 'react'
import { StyleSheet, Text, TextInputProps, View } from 'react-native'
import {
  Controller,
  Control,
  ValidationRule,
  FieldError,
} from 'react-hook-form'
import PhoneInput, { PhoneInputProps } from 'react-native-phone-number-input'
import ChevronDownIcon from '../../assets/svg/chev-down.svg'

type OwnProps = {
  defaultValue?: string
  value?: string
  rules?: ValidationRule | any
  success?: boolean
  error?: FieldError
  disabled?: boolean
  name: string
} & (
    | {
      control: Control<any>
      name: string
    }
    | {
      control?: undefined
      name?: undefined
    }
  )

type PhoneFieldProps = PhoneInputProps & OwnProps & TextInputProps

const validatePhoneNumber = (value: string) => {
  const regex = /^[0-9+]*$/
  return regex.test(value) || 'Invalid phone number format'
}

export const PhoneField = React.forwardRef<PhoneInput, PhoneFieldProps>(
  (
    {
      control,
      name,
      rules,
      defaultValue = '',
      success,
      error,
      containerStyle,
      ...props
    }: PhoneFieldProps,
    ref,
  ) => {
    const inputProps = {
      ...props,
      ref,
    }

    if (control) {
      return (
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            render={({ field: { onBlur, onChange, value } }) => {
              return (
                <PhoneInput
                  {...inputProps}
                  // textInputProps={{ onBlur }}
                  renderDropdownImage={
                    <ChevronDownIcon color={'#667085'} width={20} height={20} />
                  }
                  textInputProps={{
                    value,
                  }}
                  flagButtonStyle={styles.flagButton}
                  containerStyle={[
                    styles.phoneContainer,
                    success && styles.success,
                    error && styles.error,
                    containerStyle,
                  ]}
                  textContainerStyle={[
                    styles.wrapper,
                    styles.phoneInputContainer,
                    { width: '100%', paddingVertical: 0 },
                  ]}
                  textInputStyle={styles.textInputStyle}
                  codeTextStyle={styles.codeTextStyle}
                  onChangeText={inputValue => onChange(inputValue)}
                  value={value}
                  placeholder="Phone number"
                />
              )
            }}
            name={name}
            rules={{
              ...rules,
              validate: validatePhoneNumber,
            }}
            defaultValue={defaultValue}
          />
          {error?.message ? (
            <Text style={[styles.errorText]}>{error.message}</Text>
          ) : null}
        </View>
      )
    }

    return <PhoneInput {...inputProps} />
  },
)

PhoneField.displayName = 'PhoneField'

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',

    minWidth: 100,
    borderRadius: 4,
    paddingLeft: 23,
  },
  success: {
    borderWidth: 1,
    borderColor: 'green',
  },
  error: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  flagButton: {
    width: 70,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  phoneInputContainer: {
    width: 50,
    minWidth: 10,
    paddingLeft: 0,
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: 'transparent',
    lineHeight: 100,
  },
  phoneContainer: {
    minWidth: 100,
    width: 240,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBBFC4',
    height: 50,
  },
  inputWrapper: {
    // alignSelf: 'stretch',
  },
  textInputStyle: {
    fontSize: 16,
    fontFamily: 'moderat-regular',
    color: '#253545',

  },
  codeTextStyle: {
    padding: 0,
    textAlign: 'right',
    alignSelf: 'center',
    lineHeight: 50,
    fontSize: 16,
    fontFamily: 'moderat-regular',
    color: '#253545',
  },
})

export default PhoneField
