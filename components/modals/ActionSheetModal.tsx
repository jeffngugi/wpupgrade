import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { Box } from 'native-base'
import { SwipeableModalProps } from './types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const height = Dimensions.get('window').height

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const ActionSheetModal = ({
  children,
  isOpen,
  onHide,
  onBackdropPress,
  ...rest
}: SwipeableModalProps) => {
  return (
    <Modal
      statusBarTranslucent
      isVisible={isOpen}
      useNativeDriverForBackdrop
      coverScreen
      hideModalContentWhileAnimating
      backdropColor={'#1C1C1C50'}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={[styles.container]}
      animationInTiming={300}
      animationOutTiming={300}
      onModalHide={() => {
        onHide()
      }}
      onBackdropPress={() => {
        onBackdropPress?.()
      }}
      {...rest}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        style={{ flexGrow: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
        }}
        keyboardShouldPersistTaps="handled">
        <Box
          safeArea
          backgroundColor="white"
          paddingTop={200}
          bottom={0}
          borderTopRadius="20px">
          {children}
        </Box>
      </KeyboardAwareScrollView>
    </Modal>
  )
}

export default ActionSheetModal

const styles = StyleSheet.create({
  container: {
    margin: 0,
    shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    justifyContent: 'flex-end',
  },
  topOffset: {
    marginTop: SWIPEABLE_MODAL_OFFSET_TOP,
  },
})
