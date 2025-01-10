import React, { ReactNode } from 'react'
import { Text, Radio, Box } from 'native-base'
import { Control, Controller, FieldValues, Path, PathValue, RegisterOptions } from 'react-hook-form'

type RadioBtnProps<T extends FieldValues = FieldValues, U = any> = {
  name: Path<T>
  label: string
  placeholder?: string
  required?: boolean
  control: Control<T, U>
  leftLabel: string
  rightLabel: string
  errorMessage?: string
  rules: RegisterOptions
  defaultValue?: PathValue<T, Path<T>>
}

const RadioBtn = <T extends FieldValues = FieldValues, U = any>({
  name,
  control,
  rules,
  rightLabel,
  leftLabel,
  defaultValue,
}: RadioBtnProps<T, U>) => {
  return (
    <Controller
      name={name}
      defaultValue="first"
      rules={{ ...rules }}
      control={control}
      render={({ field: { onChange, value }, formState: { errors } }) => {
        return (
          <>
            <Radio.Group
              name="gender"
              flexDirection="row"
              defaultValue={defaultValue}
              value={value}
              onChange={val => onChange(val)}>
              <Radio value="first" colorScheme="blue">
                <Text color={'grey'} fontSize={'16px'}>
                  {leftLabel}
                </Text>
              </Radio>
              <Box mx={'16px'}></Box>
              <Radio value="second" colorScheme="pink">
                <Text color={'grey'} fontSize={'16px'}>
                  {rightLabel}
                </Text>
              </Radio>
            </Radio.Group>
            {errors[name] ? (
              <Text color="red.50">
                {errors[name]?.message as ReactNode ?? 'This field is required'}
              </Text>
            ) : null}
          </>
        )
      }}
    />
  )
}

export default RadioBtn
