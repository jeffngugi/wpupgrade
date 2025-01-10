import { StyleSheet, TextInput, View, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Box, Text } from 'native-base'
import * as SQLITE from 'expo-sqlite'
import LoaderScreen from '~components/LoaderScreen'
import { createTables, deleteDatabase } from '~utils/database/database'
import { DB_NAME } from '~utils/appConstants'

/**
 *
 * TA SQLITE CRUD FUNCTIONS
 * 1: CREATE
 * 2:UPDATE
 * 3:DELETE 1
 * 4:DELETE ALL
 * 5:DELETE TABLE(ie, on logout)
 */

const TAPlayground = () => {
  const [isLoading, setIsLoading] = useState(true)
  const db = SQLITE.openDatabase(DB_NAME)
  const [names, setNames] = useState<any[]>([])
  const [currentName, setCurrentName] = useState(undefined)

  useEffect(() => {
    createTables()
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * from names ORDER BY id DESC',
        null,
        (txObj, resultSet) => {
          setNames(resultSet.rows._array)
        },
        (txObj, error) => console.log('Error in getting names', error),
      )
    })

    setIsLoading(false)
  }, [])
  if (isLoading) {
    return <LoaderScreen />
  }

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO names (name) values (?)',
        [currentName],
        (txObj, resultSet) => {
          const existingNames = [...names]
          existingNames.push({ id: resultSet.insertId, name: currentName })
          setNames(existingNames)
          setCurrentName(undefined)
        },
        (txObj, error) => console.log(error),
      )
    })
  }

  const deleteName = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM names WHERE id = ?',
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            const existingNames = [...names].filter(name => name.id !== id)
            setNames(existingNames)
          }
        },
        (txObj, error) => console.log(error),
      )
    })
  }

  const updateName = id => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE names SET name = ? WHERE id = ?',
        [currentName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            const existingNames = [...names]
            const indexToUpdate = existingNames.findIndex(
              name => name.id === id,
            )
            existingNames[indexToUpdate].name = currentName
            setNames(existingNames)
            setCurrentName(undefined)
          }
        },
        (txObj, error) => console.log(error),
      )
    })
  }

  // const clearDB = () =>{
  //   db.transaction()
  // }

  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.name}</Text>
          <Button title="Delete" onPress={() => deleteName(name.id)} />
          <Button title="Update" onPress={() => updateName(name.id)} />
        </View>
      )
    })
  }

  return (
    <Box safeArea p="16px" flex={1}>
      <Box flex={1}>
        <Text>
          This is a playground to ensure we are able to store clock in/out in
          the devices
        </Text>
        <Button title="Add Name" onPress={addName} />
        <TextInput
          value={currentName}
          placeholder="Name"
          onChangeText={setCurrentName}
        />
        {showNames()}
      </Box>
      <Button title="Clear database" onPress={deleteDatabase}></Button>
    </Box>
  )
}

export default TAPlayground

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8,
  },
})
