import { Box } from 'native-base'
import { StyleSheet, Text } from 'react-native'
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
  Cursor,
} from 'react-native-confirmation-code-field'
import React from 'react'
export interface PinTextInputItem {
  cellCount: number
  value: string
  onChange: (text: string) => void
  autofocus?: boolean
}

export interface RenderCellItem {
  index: number
  symbol: string
  isFocused: boolean
}

function PinTextInput({
  cellCount,
  value,
  onChange,
}: PinTextInputItem): JSX.Element {
  const ref = useBlurOnFulfill({ value, cellCount })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChange,
  })

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: RenderCellItem): JSX.Element => {
    let textChild = null
    if (symbol) {
      textChild = '●'
    } else if (isFocused) {
      textChild = <Cursor />
    }
    return (
      <Text
        key={index}
        style={[
          styles.cell,
          { borderColor: index < value.length ? '#62A446' : '#BBBFC4' },
          { marginLeft: index < 1 ? 0 : 25 },
          isFocused && styles.focusCell,
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    )
  }

  return (
    <Box flexDirection="row" justifyContent="center">
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onChange}
        cellCount={cellCount}
        showSoftInputOnFocus={false}
        rootStyle={styles.codeFieldRoot}
        textContentType="oneTimeCode"
        renderCell={renderCell}
        autoFocus={false}
      />
    </Box>
  )
}

export default PinTextInput

const styles = StyleSheet.create({
  codeFieldRoot: {
    alignItems: 'center',
  },
  cell: {
    width: 54,
    height: 54,
    lineHeight: 45,
    fontSize: 30,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    display: 'flex',
    fontWeight: '500',
    justifyContent: 'center',
    paddingLeft: 1,
    paddingTop: 1,
    color: '#62A446',
  },
  focusCell: {
    borderColor: '#62A446',
  },
})
