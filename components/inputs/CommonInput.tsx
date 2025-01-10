import { KeyboardTypeOptions } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import {
  Box,
  FormControl,
  IInputProps,
  Input,
  Pressable,
  Text,
} from 'native-base'
import EyeOff from '~assets/svg/eye-off.svg'
import EyeOn from '~assets/svg/eye.svg'

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
} & IInputProps;


const CommonInput = <T extends FieldValues = FieldValues, U = any>({
  label,
  placeholder,
  keyboardType,
  name,
  control,
  rules,
  secure,
  password,
  inputProps,
  ...rest
}: CommonInputTypes<T, U>) => {
  const [show, setShow] = useState<boolean>(false)

  const EyeToggle = () => (
    <Pressable onPress={() => setShow(!show)} marginRight="16px">
      {show ? (
        <EyeOn width={20} height={20} color="#536171" />
      ) : (
        <EyeOff width={20} height={20} color="#536171" />
      )}
    </Pressable>
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
                InputRightElement={password ? <EyeToggle /> : undefined}
                type={password && !show ? 'password' : 'text'}
                fontFamily={'body'}
                fontSize="16px"
                placeholderTextColor={'red'}
                color={'charcoal'}
                height={'48px'}
                inValidOutlineColor={'red.50'}
                {...inputProps}
              />
              <FormControl.ErrorMessage>
                <Text fontFamily={'body'} fontSize={'14px'} color="red.50">
                  {errors[name]?.message as ReactNode ?? 'This field is required'}
                </Text>
              </FormControl.ErrorMessage>
            </FormControl>
          </>
        )}
      />
    </Box>
  )
}

export default CommonInput
