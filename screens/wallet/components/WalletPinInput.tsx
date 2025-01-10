import { InteractionManager, StyleSheet, TextInput, View } from 'react-native'
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'

export interface WalletPinTextInputItem {
  value: string
  setValue: (text: string) => void
  autofocus?: boolean
}

export interface RenderCellItem {
  index: number
  symbol: string
  isFocused: boolean
}
const CELL_COUNT = 4

export function WalletPinTextInput({
  value,
  setValue,
}: WalletPinTextInputItem): JSX.Element {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // setTimeout(() => ref.current?.focus(), 150)
        ref.current?.focus()
      })

      return () => task.cancel()
    }, []),
  )
  const renderCell = ({ index, symbol }: RenderCellItem): JSX.Element => {
    const hasValue = symbol !== undefined && symbol !== ''
    return (
      <TextInput
        key={index}
        onLayout={getCellOnLayoutHandler(index)}
        style={[
          styles.cell,

          hasValue && styles.filledCell,

          index === 0 && { marginLeft: 0 },
        ]}
      />
    )
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <CodeField
        // autoFocus={true}
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  fieldRow: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: 8,
  },
  cell: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 11,
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    fontSize: 20,
    fontWeight: '500',
    height: 22,
    justifyContent: 'center',
    lineHeight: 20,
    marginLeft: 25,
    paddingLeft: 1,
    paddingTop: 1,
    textAlign: 'center',
    width: 22,
    borderColor: '#82C167',
  },

  filledCell: {
    backgroundColor: '#82C167',
    borderColor: '#82C167',
    borderRadius: 11,
  },
})
