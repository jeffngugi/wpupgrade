import React from 'react'
import { isIos } from '~utils/platforms'
import CommonModal from './CommonModal'
import { Box } from 'native-base'
import MonthPicker, { EventTypes } from 'react-native-month-year-picker'

type Props = {
  pickerVisible: boolean
  setPickerVisible: (value: React.SetStateAction<boolean>) => void
  date: Date
  onChange: (event: EventTypes, selectedDate: Date) => void
}

const MonthYearModal = ({
  pickerVisible,
  setPickerVisible,
  date,
  onChange,
}: Props) => {
  return (
    <>
      {isIos ? (
        <CommonModal
          isVisible={pickerVisible}
          hideModal={() => setPickerVisible(false)}
          noPadding>
          <Box
            style={{
              position: 'absolute',
              left: -20,
              right: -20,
              bottom: -80,
            }}>
            <MonthPicker
              value={date}
              mode="short"
              onChange={onChange}
              maximumDate={new Date()}
            />
          </Box>
        </CommonModal>
      ) : (
        pickerVisible && (
          <MonthPicker value={date} mode="short" onChange={onChange} />
        )
      )}
    </>
  )
}

export default MonthYearModal
