import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import { Controller, Control, UseFormSetValue } from 'react-hook-form'
import CountryPicker from 'react-native-country-picker-modal'
import { CountryCode, Country } from 'react-native-country-picker-modal'

interface PhoneNumberInputProps {
  control: Control<any>
  setValue: UseFormSetValue<any>
  name: string
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  control,
  setValue,
  name,
}) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('KE')
  const [callingCode, setCallingCode] = useState<string>('+254')

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCallingCode(`+${country.callingCode[0]}`)
    // Optionally set a value in the form using setValue
    setValue(`${name}.countryCode`, country.cca2)
    setValue(`${name}.callingCode`, `+${country.callingCode[0]}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputContainer}>
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCode
          withFilter
          onSelect={onSelect}
        />
        <Text style={styles.callingCode}>{callingCode}</Text>
        <Controller
          control={control}
          name={`${name}.phoneNumber`}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.textInput}
              placeholder="Placeholder text"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 4,
  },
  callingCode: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    alignSelf: 'center',
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
})

export default PhoneNumberInput
