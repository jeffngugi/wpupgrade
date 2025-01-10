import React from 'react'
import { ModalProps, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Box } from 'native-base'

interface Props extends ModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  children: React.ReactNode
}

const WalletCommonModal = ({ visible, setVisible, children }: Props) => {
  return (
    <Modal
      statusBarTranslucent
      swipeThreshold={20}
      isVisible={visible}
      useNativeDriverForBackdrop
      coverScreen
      hideModalContentWhileAnimating
      backdropColor={'#1C1C1C50'}
      animationIn="slideInUp"
      animationOut="slideOutLeft"
      style={[styles.container]}
      animationInTiming={300}
      animationOutTiming={300}>
      <Box safeArea flex={1} paddingX="16px" backgroundColor="#62A446">
        {children}
      </Box>
    </Modal>
  )
}

export default WalletCommonModal

const styles = StyleSheet.create({
  container: {
    margin: 0,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'flex-end',
  },
})
