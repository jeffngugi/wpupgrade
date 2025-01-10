import React, { useState } from 'react'
import {
  MainNavigationProp,
  WalletRoutes,
  MainNavigationRouteProp,
} from '~types'
import ScreenHeader from '~components/ScreenHeader'
import ScreenContainer from '~components/ScreenContainer'
import {
  Box,
  Button,
  HStack,
  KeyboardAvoidingView,
  Switch,
  Text,
} from 'native-base'
import { useForm } from 'react-hook-form'
import DropdownInputV2 from '~components/dropdown/DropDownV2'
import { transferFrequency } from './data/useWalletData'
import DateInput from '~components/date/DateInput'
import { TRecurringAccount } from './CreateRecurringPayment'

interface Props {
  navigation: MainNavigationProp<WalletRoutes.CreateRecurringPayment2>
  route: MainNavigationRouteProp<WalletRoutes.CreateRecurringPayment2>
}

export interface TRecurringAccount2 extends TRecurringAccount {
  start_date: Date | string
  end_date: Date | string | undefined
  frequency: string
}

const CreateRecurringPayment2 = ({ navigation, route }: Props) => {
  const recurringData = route.params.item
  const [hasEndDate, setHasEndDate] = useState(false)

  const { control, handleSubmit, setValue, watch } = useForm()

  const onSubmit = data => {
    const newData: TRecurringAccount2 = {
      ...data,
      ...recurringData,
    }

    navigation.navigate(WalletRoutes.CreateRecurringPayment3, { item: newData })
  }

  const minimumDate = watch('start_date')
  const minEndDate = minimumDate ? new Date(minimumDate) : undefined

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Recurring Payments"
        onPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView flex={1} mt={'24px'}>
        <DropdownInputV2
          items={transferFrequency}
          control={control}
          setValue={value => setValue('frequency', value)}
          name="frequency"
          label="Frequency"
          rules={{
            required: {
              value: true,
              message: 'Frequency required',
            },
          }}
        />
        <Box my="8px" />
        <DateInput
          control={control}
          name="start_date"
          label="Start Date"
          minimumDate={new Date()}
          rules={{
            required: {
              value: true,
              message: 'Start date is required',
            },
          }}
        />
        <HStack alignItems="center" marginTop="24px" marginBottom="6px">
          <Switch
            isChecked={hasEndDate}
            onToggle={() => setHasEndDate(!hasEndDate)}
          />
          <Text lineHeight="24px" fontSize="16px" color="charcoal" ml="8px">
            Include End Date
          </Text>
        </HStack>
        {hasEndDate ? (
          <Box my="8px">
            <DateInput
              control={control}
              name="end_date"
              label="End Date"
              minimumDate={minEndDate}
            />
          </Box>
        ) : null}
      </KeyboardAvoidingView>
      <Button onPress={handleSubmit(onSubmit)}>Next</Button>
    </ScreenContainer>
  )
}

export default CreateRecurringPayment2
