import React from 'react'
import { Control, Controller, RegisterOptions } from 'react-hook-form'
import PhoneInput, {
  isValidNumber,
  parsePhoneNumber,
  PhoneInputProps,
} from 'react-native-phone-number-input'

interface PhoneNumberInputProps extends PhoneInputProps {
  control: Control<any>
  name: string
  rules?: RegisterOptions
  withCountryCode?: boolean
  defaultValue?: string // New prop to set the initial value
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  control,
  name,
  rules,
  withCountryCode = true,
  defaultValue, // Destructure the defaultValue prop
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue} // Pass the defaultValue to the Controller
      render={({ field: { onChange, value } }) => {
        const formattedValue = withCountryCode
          ? value
          : parsePhoneNumber(value as string)?.nationalNumber

        return (
          <PhoneInput
            value={formattedValue || ''}
            onChangeText={text => {
              const isValid = isValidNumber(text)
              onChange(isValid ? text : '')
            }}
            {...rest}
          />
        )
      }}
    />
  )
}

export default PhoneNumberInput
