import React from 'react'
import CommonModal from './CommonModal'
import { Box, Button, Text } from 'native-base'
import { WarningModalProps } from './types'
import WarningIcon from '~assets/svg/img_warning.svg'

const WarningModal = ({
  title,
  description,
  isVisible,
  hideModal,
}: WarningModalProps) => {
  return (
    <CommonModal isVisible={isVisible} hideModal={hideModal}>
      <Box alignItems={'center'}>
        <Text
          fontWeight="400"
          fontSize="18px"
          marginBottom="10px"
          color="charcoal">
          {title}
        </Text>
        <Box alignItems="center">
          <WarningIcon />
        </Box>
        <Text my={'10px'} fontSize={'16px'} textAlign={'center'}>
          {description}
        </Text>
        <Button
          onPress={hideModal}
          // marginRight="32px"
          mx={'auto'}
          width={'100%'}
          _text={{
            color: 'green.50',
            fontSize: '16px',
            fontFamily: 'heading',
          }}>
          <Text color="white" fontSize="18">
            Close
          </Text>
        </Button>
      </Box>
    </CommonModal>
  )
}

export default WarningModal
