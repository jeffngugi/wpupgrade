/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { bindActionCreators, Dispatch } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { FormattedMessage } from 'react-intl'

import {
  DeveloperTool,
  Environment,
  EnvironmentAction,
  LocaleAction,
  State,
  SupportedLocale,
} from '~declarations'
import { EnvironmentActionCreators, LocaleActionCreators } from '~store/actions'
import { setItem } from '~storage/device-storage'
import { appLocales } from '~locale/loadLocale'
import Icon from './Icon'
import Label from './Label'

const languages = require('@cospired/i18n-iso-languages')

// Support French & English languages.
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'))
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/fr.json'))

export type DevToolProps = {
  title: DeveloperTool
}

const DevTool = ({ title }: DevToolProps) => {
  const { showActionSheetWithOptions: showActionSheet } = useActionSheet()
  const dispatch: Dispatch<EnvironmentAction | LocaleAction> = useDispatch()
  const { switchEnvironment, setUserPreferredLocale } = bindActionCreators(
    { ...EnvironmentActionCreators, ...LocaleActionCreators },
    dispatch,
  )
  const {
    environments: { environments, current },
    locale: { userPreferredLocale },
  } = useSelector((state: State) => state)

  const envPressHandler = async (envLabel: Environment) => {
    await setItem('lastUsedEnvironment', envLabel)
    return dispatch(switchEnvironment(envLabel))
  }

  const langPressHandler = async (langLabel: SupportedLocale) =>
    dispatch(setUserPreferredLocale(langLabel))

  const onPress = () => {
    const langOptions = Object.keys(appLocales)
      .map(i => (i = languages.getName(i, userPreferredLocale ?? 'en')))
      .concat(['Cancel'])

    const envOptions = Object.keys(environments)
      .map(i => (i = i.charAt(0).toUpperCase() + i.slice(1)))
      .concat(['Cancel'])

    const options = title === 'environment' ? envOptions : langOptions
    const cancelButtonIndex = options.length - 1

    showActionSheet(
      {
        options,
        cancelButtonIndex,
        useModal: true,
        tintColor: styles.actionSheetOptions.tintColor,
        cancelButtonTintColor: styles.cancelButtonTintColor.color,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex === cancelButtonIndex) {
          return
        }
        title === 'environment'
          ? envPressHandler(
              options[
                Number(selectedIndex)
              ].toLowerCase() as unknown as Environment,
            )
          : langPressHandler(
              Object.keys(appLocales)[
                Number(selectedIndex)
              ] as unknown as SupportedLocale,
            )
      },
    )
  }

  return (
    <View style={styles.container}>
      <Icon label={title} />
      <TouchableOpacity onPress={onPress}>
        <View style={styles.labelAndValue}>
          <Label title={title} />
          <Text style={styles.value}>
            <FormattedMessage
              id={
                title === 'environment'
                  ? `app_environments.${current}`
                  : userPreferredLocale
                  ? `supported_languages.${userPreferredLocale}`
                  : 'supported_languages.auto'
              }
            />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    left: 10,
    marginTop: 7,
  },
  labelAndValue: {
    left: 15,
  },
  value: {
    color: '#808080',
  },
  cancelButtonTintColor: {
    color: '#d32f2f',
  },
  actionSheetOptions: {
    tintColor: '#808080',
  },
})

export default DevTool
