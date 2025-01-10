import { KeyboardTypeOptions } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Box, FormControl, IInputProps, Input, Pressable, Text } from 'native-base'
import EyeOff from '~assets/svg/eye-off.svg'
import EyeOn from '~assets/svg/eye.svg'
import SendIcon from '~assets/svg/send.svg'
import SendOkIcon from '~assets/svg/send-ok-icon.svg'

type CommonInputTypes<T extends FieldValues = FieldValues, U = any> = {
  label: string
  placeholder?: string
  required?: boolean
  keyboardType?: KeyboardTypeOptions
  name: Path<T>
  control: Control<T, U>
  secure?: boolean
  rules?: RegisterOptions
  password?: boolean
  submitValue: () => void
} & IInputProps;

const CommonInputSubmit = <T extends FieldValues = FieldValues, U = any>({
  label,
  placeholder,
  keyboardType,
  name,
  control,
  rules,
  secure,
  password,
  submitValue,
  ...rest
}: CommonInputTypes<T, U>) => {
  const [show, setShow] = useState<boolean>(false)

  const SendButton = <T extends string | number | boolean>({ value }: { value: T }) => {
    return (
      <Pressable onPress={() => submitValue()} marginRight="15px">
        {value ? (
          <SendOkIcon width={30} height={30} color="#536171" />
        ) : (
          <SendIcon width={30} height={30} color="#536171" />
        )}
      </Pressable>
    );
  };

  return (
    <Box {...rest}>
      <Controller
        control={control}
        name={name}
        rules={{ ...rules }}
        // defaultValue=""
        render={({
          field: { onChange, onBlur, value },
          formState: { errors },
        }) => (
          <>
            <FormControl isInvalid={name in errors}>
              <Input
                onBlur={onBlur}
                onChangeText={val => onChange(val)}
                _focus={{ borderColor: 'green.50' }}
                value={value}
                keyboardType={keyboardType ?? 'default'}
                backgroundColor={'transparent'}
                placeholder={placeholder ?? ''}
                secureTextEntry={secure}
                InputRightElement={<SendButton value={value} />}
                type={password && !show ? 'password' : 'text'}
                fontFamily={'body'}
                fontSize="16px"
                placeholderTextColor={'skeletonDark'}
                height={'48px'}
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

export default CommonInputSubmit
