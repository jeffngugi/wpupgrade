import React from 'react'
import CommonModal from './CommonModal'
import { Button, HStack, Text, Pressable } from 'native-base'
import { ConfirmModalProps } from './types'
import XIcon from '~assets/svg/x.svg'

const ConfirmModal = ({
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
    <CommonModal isVisible={isVisible} hideModal={hideModal}>
      <>
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

        <Text my={'20px'} fontSize={'16px'}>
          {description}
        </Text>
        <HStack justifyContent="flex-end" marginY="4px">
          <Button
            disabled={loading}
            onPress={hideModal}
            marginRight="32px"
            variant="url"
            _text={{
              color: 'green.50',
              fontSize: '16px',
              fontFamily: 'heading',
            }}>
            Cancel
          </Button>
          <Button
            isLoading={loading}
            onPress={onConfirm}
            backgroundColor="green.70"
            px="30px"
            height={'40px'}
            borderRadius={'6px'}
            alignItems={'center'}
            _text={{
              fontSize: '16px',
              fontFamily: 'heading',
            }}
            _pressed={{ backgroundColor: 'green.50' }}>
            {btbLabel ?? 'Confirm'}
          </Button>
        </HStack>
      </>
    </CommonModal>
  )
}

export default ConfirmModal
