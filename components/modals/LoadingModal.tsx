import React from 'react'
import { Spinner, Text, Modal } from 'native-base'
// import {} from 'react-native'

type LoadingModalProps = {
  message: string
  isVisible: boolean
}

const LoadingModal = ({ message, isVisible }: LoadingModalProps) => {
  return (
    <Modal isOpen={isVisible}>
      <Modal.Content
        paddingY="10px"
        backgroundColor="white"
        width={'92%'}
        alignItems={'center'}>
        <Modal.Body flexDirection={'row'}>
          <Spinner color="green.500" size={'sm'} marginRight="15px" />
          <Text fontFamily={'body'} fontSize={'16px'}>
            {message}
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

export default LoadingModal
