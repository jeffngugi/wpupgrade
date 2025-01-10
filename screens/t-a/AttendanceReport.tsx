import React, { useEffect, useState } from 'react'
import { Box, FlatList, Divider } from 'native-base'
import ColorScreenHero from '~components/ColorScreenHero'
import TAIcon from '~assets/svg/ta-report.svg'
import ModuleHeroCard from '~components/ModuleHeroCard'
import ScreenHeader from '~components/ScreenHeader'
import ActionSheetBtn from '~components/buttons/ActionSheetBtn'
import ReportItem from './components/ReportItem'
import DownloadBtn from '~components/DownloadBtn'
import { AppModules } from '~types'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import { useSelector } from 'react-redux'
import { State } from '~declarations'
import { dateToString, formatDate } from '~utils/date'
import { endOfMonth, intervalToDuration, startOfMonth } from 'date-fns'
import MonthPicker, { EventTypes } from 'react-native-month-year-picker'
import { useTAReports } from '~api/t-a/ta'
import LoaderScreen from '~components/LoaderScreen'
import EmptyState from '~components/empty-state/EmptyState'
import CommonModal from '~components/modals/CommonModal'
import { isIos } from '~utils/platforms'
import { sumBy } from 'lodash'

export type TReport = {
  duration: string
  time_in: string
  time_out: string
  time_elapsed: string | number
  attendance_date: string
}

const AttendanceReport = ({ navigation }: { navigation: any }) => {
  const {
    user: { employee_id },
  } = useSelector((state: State) => state.user)

  const [pickerVisible, setPickerVisible] = useState(false)
  const [date, setDate] = useState(new Date())
  const [dateLabel, setDateLabel] = useState(dateToString(date, 'MMM, yyyy'))
  const [startDate, setStartDate] = useState(
    formatDate(startOfMonth(date), 'backend'),
  )
  const [endDate, setEnfDate] = useState(
    formatDate(endOfMonth(date), 'backend'),
  )
  let reportData: TReport[] = []

  let workedHours = '-'
  const params = {
    'employee_id[]': employee_id,
    report_type: 'DATE_RANGE',
    start_date: startDate,
    end_date: endDate,
    plain_data: 1,
    fromQueue: 1,
  }

  const onChange = (event: EventTypes, selectedDate: Date) => {
    setPickerVisible(false)
    const currentDate = selectedDate || new Date()
    setDate(currentDate)
  }

  useEffect(() => {
    setDateLabel(dateToString(date, 'MMM, yyyy'))
    setStartDate(formatDate(startOfMonth(date), 'backend'))
    setEnfDate(formatDate(endOfMonth(date), 'backend'))
  }, [date])

  const { data, isLoading } = useTAReports(params)

  if (isLoading) return <LoaderScreen />

  reportData = data?.data ?? []

  if (reportData.length > 0) {
    const tHours = sumBy(reportData, item => Number(item.time_elapsed))
    const duration = intervalToDuration({ start: 0, end: tHours * 1000 })
    workedHours =
      `${duration.hours}:${duration.minutes}:${duration.seconds}` ?? ''
  }

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />

      <Box flex={1} bgColor="white">
        <ColorScreenHero padding>
          <ScreenHeader
            title="Attendance Report"
            onPress={() => navigation.goBack()}
            // RightItem={() => (
            //   <DownloadBtn
            //     onPress={() => navigation.navigate(TARoutes.Download)}
            //   />
            // )}
          />
          <Box mt={'24px'} />
          <ModuleHeroCard
            label="Total hours"
            value={workedHours}
            Icon={TAIcon}
          />
        </ColorScreenHero>
        <Box marginX="16px" marginTop="16px" flex={1}>
          <ActionSheetBtn
            label={dateLabel ?? '-'}
            onPress={() => setPickerVisible(true)}
          />
          {reportData.length < 1 ? (
            <EmptyState moduleName={AppModules.ta} />
          ) : (
            <FlatList
              ItemSeparatorComponent={() => <Divider />}
              showsVerticalScrollIndicator={false}
              flex={1}
              data={reportData}
              renderItem={({ item, index }) => (
                <ReportItem item={item} index={index} />
              )}
            />
          )}
        </Box>
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
      </Box>
    </SafeAreaProvider>
  )
}

export default AttendanceReport
