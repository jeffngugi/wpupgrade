import axios from 'axios'
import { isNull } from 'lodash'
import { useEffect } from 'react'
import { ClockInOut } from '~declarations'
import * as SQLite from 'expo-sqlite'
import { DB_NAME } from '~utils/appConstants'
import useGetClockAttempts from '~utils/hooks/useGetClockAttempts'
import { txnErrorCallback } from '~utils/database/database'

const db = SQLite.openDatabase(DB_NAME)

export const useClockInOut = (attempts: ClockInOut[] | null) => {
  const { refetchAttempts } = useGetClockAttempts()
  const updateTAAttempt = async (attempt: ClockInOut) => {
    const clockId = attempt.clockId
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE attempts SET submitted = ?, status = ?, message = ? WHERE clockId = ?',
        [attempt.submitted, attempt.status, attempt.message, clockId],
        () => {
          refetchAttempts()
        },
        txnErrorCallback,
      )
    })
  }
  const createClockInOut = async (attempt: ClockInOut) => {
    const url = isNull(attempt.time_in)
      ? 'attendance/clock/out'
      : 'attendance/clock/in'
    const { data } = await axios.post(url, attempt)

    if (!data?.success) {
      //update data with unsuccessful values and reasons
    } else if (data?.success) {
      const newAttempt = { ...attempt }
      newAttempt.submitted = 1
      newAttempt.status = 'success'
      newAttempt.message = 'Attempt successful'
      updateTAAttempt(newAttempt)
    } else if (
      data?.message === 'Already clocked out' ||
      data?.message === 'Already clocked in'
    ) {
      const newAttempt = { ...attempt }
      newAttempt.submitted = 1
      newAttempt.status = 'success'
      newAttempt.message = 'Attempt successful'
      updateTAAttempt(newAttempt)
    } else if (data?.message?.toString().toUpperCase().includes('SUCCESS')) {
      const newAttempt = { ...attempt }
      newAttempt.submitted = 1
      newAttempt.status = 'success'
      newAttempt.message = 'Attempt successful'
      updateTAAttempt(newAttempt)
    }
    return data
  }
  const handleClockInOut = (attempts: ClockInOut[]) => {
    for (const attempt of attempts) {
      if (attempt.submitted === 0) {
        createClockInOut(attempt)
      }
    }
  }
  useEffect(() => {
    if (!isNull(attempts)) {
      handleClockInOut(attempts)
    }
  }, [attempts])
}
