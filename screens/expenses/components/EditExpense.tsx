import { useRoute } from '@react-navigation/native'
import {
  Box,
  Button,
  HStack,
  ScrollView,
  Spacer,
  Switch,
  Text,
  TextArea,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DateInput from '~components/date/DateInput'
import DropDownPicker, { optionsType } from '~components/DropDownPicker'
import CommonInput from '~components/inputs/CommonInput'

const categories = [
  { value: 'food', label: 'food ' },
  { value: 'lunch', label: 'lunch ' },
  { value: 'fare', label: 'fare ' },
  { value: 'rent', label: 'rent ' },
  { value: 'internet', label: 'internet ' },
  { value: 'faiba', label: 'faiba ' },
]

const paymenthMethodItems = [
  { value: 'BANK', label: 'Bank' },
  { value: 'MPESA', label: 'M-pesa' },
  { value: 'CASH', label: 'Cash' },
]

const EditExpense = () => {
  const route = useRoute()
  const { expenseDetail } = route.params
  const { control, setValue } = useForm()
  const [open, setOpen] = useState(false)
  const [category, SetCatgory] = useState('')
  const [items, setItems] = useState<optionsType[]>()

  const [payment, setPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentItems, setPaymentItems] = useState<optionsType[]>()

  useEffect(() => {
    setValue('title', 'testing expenses edit')
  }, [])

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <CommonInput name="title" control={control} label="Title" />
        <Text mt="10px" mb="4px">
          Category
        </Text>
        <DropDownPicker
          control={control}
          value={'internet'}
          open={open}
          options={categories}
          setOptions={setItems}
          setValue={SetCatgory}
          setOpen={setOpen}
          rules={{
            required: { value: true, message: 'Category is required' },
          }}
          name="category"
        />
        <HStack justifyContent="space-between" alignItems="center" mt="10px">
          <Box width="48%">
            <Text mb="4px">Expense Date</Text>
            <DateInput control={control} name="expense_date" />
          </Box>
          <Box width="48%">
            <CommonInput name="amount" control={control} label="Amount" />
          </Box>
        </HStack>
        <HStack alignItems="center" justifyContent="space-between" my="12px">
          <Text>Paid expense</Text>
          <Switch />
        </HStack>
        <Text mt="10px" mb="4px">
          Payment Method
        </Text>
        <DropDownPicker
          control={control}
          value={paymentMethod}
          open={payment}
          options={paymenthMethodItems}
          setOptions={setPaymentItems}
          setValue={setPaymentMethod}
          setOpen={setPayment}
          rules={{
            required: { value: true, message: 'Payment Method is required' },
          }}
          name="payment_method"
        />
        <Box my="8px" />
        <CommonInput
          name="phone"
          control={control}
          label="Mobile notification number"
        />
        <Text mt="24px">Notes</Text>
        <TextArea autoCompleteType={undefined} />
      </ScrollView>
      <Button>
        <Text color="white">Save</Text>
      </Button>
    </Box>
  )
}

export default EditExpense
