import React from 'react'

import { Button, HStack, Text, Pressable, Box } from 'native-base'
import { ConfirmModalProps } from './types'
import XIcon from '~assets/svg/x.svg'
import SwipableModal from './SwipableModal'

const InfoModal = ({
  title,
  description,
  onConfirm,
  isVisible,
  hideModal,
  btbLabel,
  closeIcon,
  loading,
}: ConfirmModalProps) => {
  return (
    <SwipableModal isOpen={isVisible} onHide={hideModal}

    >
      <Box mx='16px'>
        <HStack>
          <Text
            fontWeight="400"
            fontSize="20px"
            marginBottom="10px"
            color="charcoal">
            {title}
          </Text>

          {closeIcon ? (
            <Pressable onPress={hideModal} ml={'auto'}>
              <XIcon color="#061938" width={24} height={24} />
            </Pressable>
          ) : null}
        </HStack>

        <Text my={'20px'} fontSize={'16px'} mt='4px'>
          {description}
        </Text>
        <HStack marginY="4px">

          <Button
            isLoading={loading}
            onPress={onConfirm ?? hideModal}
            backgroundColor="green.70"
            px="30px"
            height={'56px'}
            mt={'16px'}
            borderRadius={'6px'}
            alignItems={'center'}
            _text={{
              fontSize: '16px',
              fontFamily: 'heading',
            }}
            width={'100%'}
            _pressed={{ backgroundColor: 'green.50' }}>
            {btbLabel ?? 'Close'}
          </Button>
        </HStack>
      </Box>
    </SwipableModal>
  )
}

export default InfoModal
