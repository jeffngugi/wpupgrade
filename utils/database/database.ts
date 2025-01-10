import * as SQLite from 'expo-sqlite'
import { DB_NAME } from '~utils/appConstants'
import { createClockAttemptsQueryTable, createNamesQueryTable } from './tables'
import { noop } from 'lodash'

const db = SQLite.openDatabase(DB_NAME)

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(createNamesQueryTable)
  })
  db.transaction(tx => {
    tx.executeSql(createClockAttemptsQueryTable)
  })
}

export const createDatabase = async () => {
  createTables()
}

export const txnErrorCallback = (
  txnObj: SQLite.SQLTransaction,
  error: SQLite.SQLError,
): boolean => {
  console.log('error in SQLIte', error)
  return false
}

/**
 * For Testing
 */
export const deleteDatabase = () => {
  db.transaction(
    tx => {
      tx.executeSql('DROP TABLE names')
      tx.executeSql('DROP TABLE attempts')
    },
    noop,
    noop,
  )
}
