import React, { ReactNode } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const KeyBoardScrollView = ({ children }: { children: ReactNode }) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      nestedScrollEnabled>
      {children}
    </KeyboardAwareScrollView>
  )
}

export default KeyBoardScrollView
