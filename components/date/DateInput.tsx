import React, { ReactNode, useState } from 'react'
import { StyleSheet, TextInput, TextStyle } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Controller, RegisterOptions, Control, FieldValues } from 'react-hook-form'
import format from 'date-fns/format'
import { Box, FormControl, Pressable, Text } from 'native-base'

declare type DateInputProps<T extends FieldValues = FieldValues, U = any> = {
  backgroundColor?: string | '#FFFFFF'
  borderColor?: string
  rules?: RegisterOptions
  control: Control<T, U>
  name: string
  label?: string
  width?: string
  inputStyleOverride?: TextStyle
  mode?: 'time' | 'date' | 'datetime'
  maximumDate?: Date
  minimumDate?: Date
  defaultValue?: string
  editable?: boolean
}

const DateInput = <T extends FieldValues = FieldValues, U = any>({ ...props }: DateInputProps<T, U>) => {
  const [open, setOpen] = useState(false)

  const hideDatepicker = () => {
    setOpen(false)
  }

  const mode = props.mode ?? 'date'
  return (
    <Box width={props.width ? props.width : '100%'}>
      <Controller
        control={props.control}
        rules={{ ...props.rules }}
        render={({ field: { onChange, value }, formState: { errors } }) => (
          <>
            <Pressable onPress={() => setOpen(true)}>
              <FormControl isInvalid={errors[props.name] ? true : false}>
                <FormControl.Label>
                  <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                    {props.label}
                  </Text>
                </FormControl.Label>
                <TextInput
                  style={[
                    Styles(props).input,
                    props.inputStyleOverride,
                    {
                      borderColor: errors[props.name] ? 'red.50' : '#BBBFC4',
                    },
                    { height: 48, fontFamily: 'moderat-regular', fontSize: 16 },
                  ]}
                  value={
                    value
                      ? mode === 'date'
                        ? format(value, 'dd/MM/yyyy')
                        : props.mode === 'time'
                          ? format(value, 'HH:mm:ss')
                          : format(value, 'dd/MM/yyyy HH:mm:ss')
                      : !value && props.defaultValue
                        ? props.defaultValue
                        : undefined
                  }
                  placeholder={
                    mode === 'date'
                      ? 'dd/mm/yy'
                      : props.mode === 'time'
                        ? '00:00'
                        : 'dd/mm/yyyy 00:00'
                  }
                  onTouchStart={() => {
                    setOpen(true)
                  }}
                  placeholderTextColor={'#BBBFC4'}
                  editable={false}
                />
                <FormControl.ErrorMessage>
                  <Text fontFamily={'body'} fontSize={'14px'} color={'red.50'}>
                    {errors[props.name]?.message as ReactNode || '* Invalid values !'}
                  </Text>
                </FormControl.ErrorMessage>
              </FormControl>
            </Pressable>
            <DateTimePickerModal
              isVisible={open}
              style={[Styles(props).dateTimePicker]}
              mode={mode}
              themeVariant="light"
              onConfirm={date => {
                onChange(date)
                hideDatepicker()
              }}
              onCancel={hideDatepicker}
              maximumDate={props.maximumDate || new Date(2099, 12, 12)}
              minimumDate={props.minimumDate || new Date(1974, 12, 12)}
            />
          </>
        )}
        name={props.name}
      />
    </Box>
  )
}

export default DateInput

const Styles = (props: Props) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
    },
    input: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'moderat-medium',
      height: 42,
      borderWidth: 1,
      borderColor: '#BBBFC4',
      color: '#253545',
      backgroundColor: props.backgroundColor,
      borderRadius: 4,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    dateTimePicker: {
      marginTop: 6,
      marginLeft: 4,
      opacity: 0.7,
    },
    error: {
      fontSize: 12,
      color: '#F14B3B',
      padding: 3,
    },
    displayTextContainer: {
      width: '100%',
      borderRadius: 6,
      backgroundColor: props.backgroundColor,
      borderWidth: 1,
      borderColor: props.borderColor,
    },
    displayText: {
      fontSize: 16,
      fontWeight: '400',
      fontFamily: 'moderat-medium',
      color: '#253545',
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    invalidError: {
      fontSize: 12,
      color: '#F14B3B',
      padding: 3,
    },
  })
}

// const DateInput = () => {
//   const [open, setOpen] = useState<boolean>(false)
//   const minimum = new Date(2021, 12, 12)
//   const maximum = new Date(2022, 12, 12)

//   const hidePicker = () =>{
//     setOpen(false)
//   }
//   const onConfirm = ()=>{
//     setOpen(false)
//   }
//   return (
//     <>
//    <Pressable
//     onPress={()=>setOpen(true)}
//    >
//     <Text>Jeff Nggugi</Text>
//    </Pressable>
// <DateTimePickerModal
//   mode='datetime'
//   isVisible={open}
//   onCancel={hidePicker}
//   onConfirm={onConfirm}
//   onHide={hidePicker}
//   maximumDate={minimum}
//   minimumDate={maximum}

// />
//    </>

//   )
// }

// export default DateInput

// const styles = StyleSheet.create({})
