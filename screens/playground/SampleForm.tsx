import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Box, Button } from 'native-base'
import { useForm } from 'react-hook-form'
import TextAreaInput from '../../components/inputs/TextAreaInput'
import CommonInput from '../../components/inputs/CommonInput'
import { emailRegex } from '../../utils/regex'
import AppSwitch from '../../components/inputs/AppSwitch'
import RadioBtn from '../../components/inputs/RadioBtn'
import DateInput from '../../components/date/DateInput'
import DropDownPicker from '~components/DropDownPicker'
import PhoneInput from 'react-native-phone-number-input'
import PhoneField from '~components/inputs/PhoneField'

const SampleForm = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [items, setItems] = useState([
    { label: 'Spain', value: 'spain' },
    { label: 'Madrid', value: 'madrid' },
    { label: 'Barcelona', value: 'barcelona' },
    { label: 'Italy', value: 'italy' },
    { label: 'Rome', value: 'rome' },
    { label: 'Finland', value: 'finland' },
  ])

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setError,
  } = useForm()

  const phoneRef = useRef<PhoneInput>(null)

  const onSubmit = data => {
    if (phoneRef.current?.isValidNumber(data.phoneNumber) === false) {
      setError('phoneNumber', {
        message: 'Phone number is ivalid',
      })
      return
    }
    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${
      data.phoneNumber
    }`
    console.log('Your phone number is', mobileNumber)
  }

  return (
    <Box safeArea>
      <CommonInput
        label={'firstName'}
        name={'name'}
        rules={{
          required: { value: true, message: 'Please provide a date' },
        }}
        control={control}
      />
      {/* <RadioBtn
        control={control}
        name="gender"
        label={''}
        rules={{
          required: { value: true, message: 'Please provide a gender' },
        }}
      /> */}

      <PhoneField
        control={control}
        name="phoneNumber"
        error={isDirty ? errors.phoneNumber : undefined}
        ref={phoneRef}
        textInputStyle={{ height: 40, paddingLeft: 0 }}
        defaultCode="CA"
        placeholder="Phone #"
        containerStyle={{ width: '100%', height: 46 }}
        disabled={false}
        rules={{
          required: { value: true, message: 'Provide phone number' },
        }}
      />
      <Box marginY={10}>
        <DateInput
          control={control}
          name={'dob'}
          rules={{
            required: { value: true, message: 'Please provide a date' },
          }}
        />
      </Box>
      {/* <TextAreaInput name={'notes'} label="notes" /> */}
      {/* <DropDownPicker
        name="city"
        value={value}
        options={items}
        control={control}
        setValue={setValue}
        open={open}
        setOptions={setItems}
        setOpen={setOpen}
        rules={{
          required: { value: true, message: 'Please select date of birth' },
        }}
      /> */}
      <Button onPress={handleSubmit(onSubmit)} colorScheme="pink">
        Submit
      </Button>
    </Box>
  )
}

export default SampleForm

const styles = StyleSheet.create({})
