import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Config from "react-native-config";

const App = () => {
  console.log('The config is', Config)
  return (
    <View style={{alignItems: 'center', flex: 1, justifyContent:'center'}}>
      <Text>Test react native config for android</Text>
      <Text> Installed expo local authentication</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})