import React, { useEffect } from 'react'
import { Box, Text, ScrollView, Button } from 'native-base'
import CommonInput from '~components/inputs/CommonInput'
import DateInput from '~components/date/DateInput'
import TextAreaInput from '~components/inputs/TextAreaInput'
import { useForm } from 'react-hook-form'

const AdvanceEdit = () => {
  const { control, setValue } = useForm()

  useEffect(() => {
    setValue('amount', '2000')
    setValue('date', new Date())
  }, [])
  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <CommonInput name="amount" control={control} label="Amount" />
        <Box my="12px">
          <Text mb="5px">Date of issue</Text>
          <DateInput control={control} name="date" mode="date" />
        </Box>
        <Text>Notes</Text>
        <TextAreaInput name="notes" control={control} />
      </ScrollView>
      <Button>Save</Button>
    </Box>
  )
}

export default AdvanceEdit
