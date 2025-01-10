import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { FormattedMessage } from 'react-intl'
import { DeveloperTool } from '~declarations'

type LabelProps = {
  title: DeveloperTool
}

const Label = ({ title }: LabelProps) => (
  <Text style={styles.container}>
    <FormattedMessage id={`developer_tools.options.${title}`} />
  </Text>
)

const styles = StyleSheet.create({
  container: {
    fontWeight: '600',
    fontSize: 15,
  },
})

export default Label
