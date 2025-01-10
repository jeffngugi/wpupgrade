import React, { useEffect, useState } from 'react'
import { Box, Divider, HStack, Heading, Pressable, Text } from 'native-base'
import BarGraph from './BarGraph'
import MonthYearBtn from '~components/buttons/MonthYearBtn'
import { dateToString } from '~utils/date'
import { EventTypes } from 'react-native-month-year-picker'
import MonthYearModal from '~components/modals/MonthYearModal'

const barData = {
  moneyIn: [
    {
      value: 1600,
      label: 'JAN',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: '#536171' }}>KES 1600</Text>
      ),
    },
    {
      value: 1290,
      label: 'Feb',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: '#536171' }}>KES 1290</Text>
      ),
    },
    {
      value: 900,
      label: 'Mar',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: 'grey' }}>KES 900</Text>
      ),
    },
  ],
  moneyOut: [
    {
      value: 1700,
      label: 'JAN',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: '#536171' }}>KES 1700</Text>
      ),
    },
    {
      value: 3000,
      label: 'Feb',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: '#536171' }}>KES 3000</Text>
      ),
    },
    {
      value: 2000,
      label: 'Mar',
      topLabelComponent: () => (
        <Text style={{ fontSize: 16, color: 'grey' }}>KES 2000</Text>
      ),
    },
  ],
}

const SpendItem = () => (
  <HStack justifyContent="space-between" my="8px">
    <Text lineHeight="24px" fontSize="16px" color="grey">
      Transfers
    </Text>
    <Text lineHeight="24px" fontSize="16px" color="#253545">
      Kes 58,2085
    </Text>
  </HStack>
)

const WalletSpendOverview = () => {
  const [moneyIn, setMoneyIn] = useState(true)
  const [date, setDate] = useState(new Date())
  const [pickerVisible, setPickerVisible] = useState(false)
  const [dateLabel, setDateLabel] = useState(dateToString(date, 'MMM, yyyy'))
  const handleChangeStatus = () => setMoneyIn(!moneyIn)

  const onChange = (event: EventTypes, selectedDate: Date) => {
    setPickerVisible(false)
    const currentDate = selectedDate || new Date()
    setDate(currentDate)
  }

  useEffect(() => {
    setDateLabel(dateToString(date, 'MMM yyyy'))
  }, [date])

  return (
    <Box px="16px" mt="10px">
      <HStack justifyContent="space-between" alignItems="center" marginY="16px">
        <Heading fontSize="16px" lineHeight="26px">
          Spend Overview
        </Heading>
        <MonthYearBtn
          label={dateLabel ?? ''}
          onPress={() => setPickerVisible(true)}
        />
      </HStack>
      <Box borderWidth={1} borderColor="#E3E9EC" borderRadius="8px">
        <HStack justifyContent="space-between" mb="16px">
          <Pressable
            onPress={handleChangeStatus}
            width="48%"
            py="12px"
            pl="14px"
            disabled={moneyIn}
            backgroundColor={moneyIn ? 'transparent' : '#E4E5E7'}
            borderBottomRightRadius="7px">
            <Text fontSize="14px">Money in</Text>
            <Heading fontSize="18px">KES 582,085</Heading>
          </Pressable>
          <Pressable
            onPress={handleChangeStatus}
            width="48%"
            py="12px"
            disabled={!moneyIn}
            backgroundColor={moneyIn ? '#E4E5E7' : 'transparent'}
            pl="14px"
            borderBottomLeftRadius="7px">
            <Text fontSize="14px">Money out</Text>
            <Heading fontSize="18px">KES 582,085</Heading>
          </Pressable>
        </HStack>
        {moneyIn ? (
          <BarGraph barData={barData.moneyIn} moneyIn={moneyIn} />
        ) : (
          <BarGraph barData={barData.moneyOut} moneyIn={moneyIn} />
        )}
        <Divider my="14px" />
        <Box px="14px" mb="16px">
          <SpendItem />
          <SpendItem />
          <SpendItem />
          <SpendItem />
        </Box>
      </Box>
      <MonthYearModal
        pickerVisible={pickerVisible}
        setPickerVisible={setPickerVisible}
        date={date}
        onChange={onChange}
      />
    </Box>
  )
}

export default WalletSpendOverview
