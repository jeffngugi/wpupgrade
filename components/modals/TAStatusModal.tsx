import React from 'react'
import CommonModal from './CommonModal'
import { Box, HStack, Text, Pressable, Spinner } from 'native-base'
import { TAStatusModalProps } from './types'
import XIcon from '~assets/svg/x.svg'
import QRIcon from '~assets/svg/qr-code.svg'
import LocationIcon from '~assets/svg/location-pin.svg'
import CheckIcon from '~assets/svg/check.svg'

const TAStatusModal = ({
  description,
  isVisible,
  hideModal,
  closeIcon,
  action,
  usesQR,
}: TAStatusModalProps) => {
  return (
    <CommonModal isVisible={isVisible} hideModal={hideModal} noPadding>
      <Box p={'16px'}>
        <HStack mt="0px">
          {closeIcon ? (
            <Pressable onPress={hideModal} ml={'auto'}>
              <XIcon color="#061938" width={24} height={24} />
            </Pressable>
          ) : null}
        </HStack>
        <Box alignItems="center">
          {usesQR && <QRIcon />}
          {!usesQR && <LocationIcon />}
        </Box>
        <HStack
          justifyContent="center"
          alignItems="center"
          mt={'35px'}
          mb={'60px'}>
          {action === 'success' && (
            <CheckIcon color="#62A446" width={24} height={24} />
          )}
          {action === 'failed' && (
            <XIcon color="#F14B3B" width={24} height={24} />
          )}
          {action === 'loading' && <Spinner color="#62A446" />}

          <Text fontSize={'16px'} ml="10px" color={'grey'}>
            {description}
          </Text>
        </HStack>
      </Box>
    </CommonModal>
  )
}

export default TAStatusModal
