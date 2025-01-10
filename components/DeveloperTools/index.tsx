import React, { useRef, useEffect } from 'react'
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ListRenderItem,
} from 'react-native'
import Config from 'react-native-config'
import { bindActionCreators, Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { FormattedMessage } from 'react-intl'
import RBSheet from 'react-native-raw-bottom-sheet'

import {
  DeveloperTool as DevToolLabel,
  Environment,
  EnvironmentAction,
} from '~declarations'
import { EnvironmentActionCreators } from '~store/actions'
import { getItem } from '~storage/device-storage'
import DevTool from './DevTool'

const devToolsMenuItems = ['Environment', 'Language']
const devTools = Array(devToolsMenuItems.length)
  .fill({})
  .map((i, j) => (i = { id: String(j), title: devToolsMenuItems[j] }))

const DeveloperTools = () => {
  const BottomsheetRef = useRef<RBSheet | null>(null)
  const dispatch: Dispatch<EnvironmentAction> = useDispatch()
  const { switchEnvironment } = bindActionCreators(
    EnvironmentActionCreators,
    dispatch,
  )

  useEffect(() => {
    ;(async () => {
      const lastUsedEnvironment: Environment | null | undefined = await getItem(
        'lastUsedEnvironment',
      )
      if (lastUsedEnvironment) {
        dispatch(switchEnvironment(lastUsedEnvironment))
      }
    })()
  }, [])

  if (Config.ENABLE_DEVELOPER_TOOLS !== '1') {
    return null
  }

  const renderDevtool: ListRenderItem<{
    id: string
    title: string
  }> = ({ item }) => (
    <DevTool title={item.title.toLowerCase() as unknown as DevToolLabel} />
  )

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => BottomsheetRef.current?.open()}>
        <FontAwesome name="cogs" size={24} />
        <FormattedMessage id="developer_tools.label" />
      </TouchableOpacity>
      <RBSheet
        ref={ref => (BottomsheetRef.current = ref)}
        closeOnDragDown
        animationType="fade"
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#808080',
          },
        }}>
        <FlatList data={devTools} renderItem={renderDevtool} />
      </RBSheet>
    </>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '37%',
    position: 'absolute',
    right: 10,
    bottom: Platform.select({
      ios: 20,
      default: 10,
    }),
    alignSelf: 'flex-end',
  },
  envBottomsheetTitle: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#808080',
  },
  envBottomsheetDivider: {
    borderBottomColor: '#808080',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  envContainer: {
    flex: 1,
  },
  environment: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 17,
  },
})

export default DeveloperTools
