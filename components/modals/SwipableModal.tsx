import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { Box } from 'native-base'
import { SwipeableModalProps } from './types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const height = Dimensions.get('window').height

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const SwipableModal = ({
  children,
  isOpen,
  onHide,
  onSwipeComplete,
  onBackdropPress,
  addTopOffset,
  androidScrollDisabled,
  ...rest
}: SwipeableModalProps) => {
  return (
    <Modal
      statusBarTranslucent
      swipeThreshold={20}
      isVisible={isOpen}
      useNativeDriverForBackdrop
      coverScreen
      hideModalContentWhileAnimating
      backdropColor={'#1C1C1C50'}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={[styles.container]}
      animationInTiming={300}
      animationOutTiming={300}
      onModalHide={() => {
        onHide()
      }}
      onSwipeComplete={() => {
        onSwipeComplete?.()
      }}
      onBackdropPress={() => {
        onBackdropPress?.()
      }}
      {...rest}>
      <KeyboardAwareScrollView
        enableOnAndroid={androidScrollDisabled ? false : true}
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

export default SwipableModal

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
