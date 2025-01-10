import { Dimensions, StyleSheet } from 'react-native'
import React, { PropsWithChildren } from 'react'
import Modal from 'react-native-modal'
import { Box, Button, Text } from 'native-base'
import { SwipeableModalProps } from './types'
import StatusAvatar from '../status/StatusAvatar'
const height = Dimensions.get('window').height

type SuccessModalProps = {
  title: string
  message: string
  btnLabel: string
  onPressBtn: () => void
} & SwipeableModalProps

export const SWIPEABLE_MODAL_OFFSET_TOP = 110
export const SWIPEABLE_MODAL_HEIGHT = height - SWIPEABLE_MODAL_OFFSET_TOP

const SuccessModal = ({
  children,
  isOpen,
  onHide,
  onSwipeComplete,
  onBackdropPress,
  addTopOffset,
  onPressBtn,
  title,
  message,
  btnLabel,
  ...rest
}: SuccessModalProps) => {
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
      onSwipeComplete={() => {
        onSwipeComplete?.()
      }}
      onBackdropPress={() => {
        onBackdropPress?.()
      }}
      {...rest}>
      <Box
        safeArea
        backgroundColor="white"
        alignItems="center"
        paddingY={'35px'}
        paddingX={'24px'}
        marginX="16px"
        bottom={'30px'}
        borderRadius="8px"
        textAlign="center"
        borderBottomColor={'red.10'}>
        <Box marginBottom={'24px'}>
          <StatusAvatar width={100} height={100} borderd status="success" />
        </Box>
        <Text fontFamily={'heading'} color="charcoal" fontSize="20px">
          {title}
        </Text>
        <Text
          textAlign="center"
          marginY="10px"
          fontFamily={'body'}
          fontSize={'16px'}>
          {message}
        </Text>
        <Button
          onPress={onPressBtn}
          marginTop="10px"
          width="100%"
          paddingY="3px"
          backgroundColor="green.20"
          variant="defaultButton"
          _pressed={{ backgroundColor: 'green.10' }}
          _text={{
            color: 'green.50',
            fontFamily: 'heading',
            fontSize: '16px',
          }}>
          {btnLabel}
        </Button>
      </Box>
    </Modal>
  )
}

export default SuccessModal

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  topOffset: {
    marginTop: SWIPEABLE_MODAL_OFFSET_TOP,
  },
})
