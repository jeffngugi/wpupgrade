import * as SQLite from 'expo-sqlite/legacy'
import { ClockInOut } from '~declarations'
import { DB_NAME } from '~utils/appConstants'
import { txnErrorCallback } from '../database'

//Functions:
// 1:create an attempt record
// 2 edit an attempt record
// 3: delete an attempt record
// 4: Clear all the attempts records

const db = SQLite.openDatabase(DB_NAME)
const getAttemptsQuery = 'SELECT * FROM attempts ORDER BY id DESC'

export const getClockAttemptsFromDb = (): Promise<ClockInOut[]> => {
  return new Promise(resolve =>
    db.transaction(tx => {
      tx.executeSql(
        getAttemptsQuery,
        [],
        (txObj, { rows }) => resolve((rows as any)._array),
        txnErrorCallback,
      )
    }),
  )
}

export const createAttemptQuery =
  'INSERT INTO attempts (clockId, company_id, employee_id, latitude, longitude, submitted, expireAt, status, message, time_in, time_out, check_point, address, detection_mode, project_id, supervisor_id, qr_code_company_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
