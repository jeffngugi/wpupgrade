import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { isNull } from 'lodash'
import { taQKeys } from '~api/QueryKeys'
import { ClockInOut } from '~declarations'

export type TReportParams = {
  'employee_id[]': string | number
  report_type: string
  start_date: string
  end_date: string
}

const TAReports = async (filters: TReportParams) => {
  const { data } = await axios.get('attendance/attendance-report', {
    params: filters,
  })
  return data
}

export const useTAReports = (params: TReportParams) => {
  const data = useQuery([...taQKeys.report, params.start_date], () =>
    TAReports(params),
  )
  return data
}

export const createClockInOut = async (attempt: ClockInOut) => {
  const url = isNull(attempt.time_in)
    ? 'attendance/clock/out'
    : 'attendance/clock/in'
  const { data } = await axios.post(url, attempt)

  return data
}

export const handleClockInOut = (attempts: ClockInOut[]) => {
  for (const attempt of attempts) {
    createClockInOut(attempt)
  }
}
