import { StyleSheet } from 'react-native'
import React from 'react'
import { FormControl, Switch } from 'native-base'
import { Control, Controller, FieldErrors } from 'react-hook-form'

type AppSwitchProps = {
  required?: boolean
  name: string
  control: Control
  errors: FieldErrors
  errorMessage?: string
}

const AppSwitch = ({ control, name, errors }: AppSwitchProps) => {
  return (
    <FormControl isInvalid={name in errors}>
      <Controller
        control={control}
        render={({ field: {} }) => (
          <Switch
          // onToggle={(val: boolean) => onChange(val)}
          // isChecked={value}
          />
        )}
        name={name}
        defaultValue={true}
      />
      <FormControl.ErrorMessage>
        {errors.rememberMe?.message}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}

export default AppSwitch
