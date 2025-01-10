import React from 'react'
import { Box } from 'native-base'
import Modal from 'react-native-modal'
import { CommonModalProps } from './types'

const CommonModal = ({
  isVisible,
  hideModal,
  children,
  onBackdropPress,
  noPadding,
  style,
  ...rest
}: CommonModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      backdropColor="#1C1C1C50"
      backdropOpacity={1}
      animationIn={'fadeIn'}
      animationOut={'slideOutUp'}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      onModalHide={() => {
        hideModal()
      }}
      onBackdropPress={() => {
        onBackdropPress?.()
      }}

      {...rest}>
      <Box
        backgroundColor="white"
        padding={noPadding ? 0 : '24px'}
        borderRadius="8px"
        style={style}>
        {children}
      </Box>
    </Modal>
  )
}

export default CommonModal
