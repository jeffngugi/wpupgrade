import React from 'react'
import {
  TextInputProps,
  SafeAreaView,
  StyleSheet,
  TextInput as Input,
} from 'react-native'

import { Text } from '../components/Themed'

interface Props extends TextInputProps {
  label?: string
}

const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  keyboardType,
  secureTextEntry,
  ...rest
}: Props) => {
  return (
    <SafeAreaView>
      <Text style={styles.label}>{label}</Text>
      <Input
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={Boolean(secureTextEntry)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  label: {
    left: 10,
    height: 17,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: '#536171',
  },
  input: {
    borderColor: '#BBBFC4',
    borderRadius: 4,
    height: 48,
    marginTop: 2,
    borderWidth: 1,
    padding: 10,
  },
})

export default TextInput
