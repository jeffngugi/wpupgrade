import React from 'react'
import CommonModal from './CommonModal'
import { Button, HStack, Text, Pressable } from 'native-base'
import { DeleteModalProps } from './types'
import XIcon from '~assets/svg/x.svg'

const DeleteModal = ({
  title,
  description,
  onDelete,
  isVisible,
  hideModal,
  btbLabel,
  closeIcon,
  loading,
}: DeleteModalProps) => {
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
            onPress={onDelete}
            backgroundColor="red.50"
            px="30px"
            height={'40px'}
            borderRadius={'6px'}
            alignItems={'center'}
            _text={{
              fontSize: '16px',
              fontFamily: 'heading',
            }}
            _pressed={{ backgroundColor: 'red.30' }}>
            {btbLabel ?? 'Delete'}
          </Button>
        </HStack>
      </>
    </CommonModal>
  )
}

export default DeleteModal
