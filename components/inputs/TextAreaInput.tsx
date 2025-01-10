import React from 'react'
import { FormControl, TextArea, Text, Box } from 'native-base'
import { Controller, Control, RegisterOptions, FieldValues } from 'react-hook-form'

type TextAreaInputProps<T extends FieldValues = FieldValues, U = any> = {
  label?: string
  placeholder?: string
  name: string
  required?: boolean
  control: Control<T, U>
  rules?: RegisterOptions
  password?: boolean
}

const TextAreaInput = <T extends FieldValues = FieldValues, U = any>({
  label,
  placeholder,
  name,
  required,
  control,
  rules,
  ...rest
}: TextAreaInputProps<T, U>) => {
  return (
    <Box {...rest}>
      <Controller
        control={control}
        name={name}
        rules={{ ...rules }}
        defaultValue=""
        render={({
          field: { onChange, onBlur, value },
          formState: { errors },
        }) => {
          return (
            <FormControl isRequired={required} isInvalid={name in errors}>
              {label ? (
                <FormControl.Label>
                  <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                    {label}
                  </Text>
                </FormControl.Label>
              ) : (
                ''
              )}
              <TextArea
                onBlur={onBlur}
                placeholder={placeholder ?? ''}
                onChangeText={val => onChange(val)}
                defaultValue={value}
                autoCompleteType={undefined}
                backgroundColor={'transparent'}
                h={'99px'}
                marginTop={'0px'}
                fontFamily={'body'}
                fontSize="16px"
                placeholderTextColor={'red'}
                color={'charcoal'}
                _invalid={{ borderColor: 'red.50' }}
                inValidOutlineColor={'red.50'}
                _focus={{ borderColor: 'green.50' }}
              />
              <FormControl.ErrorMessage>
                <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                  {errors?.[name]?.message ?? 'This field is required'}
                </Text>
              </FormControl.ErrorMessage>
            </FormControl>
          )
        }}
      />
    </Box>
  )
}

export default TextAreaInput
