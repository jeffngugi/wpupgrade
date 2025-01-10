import React from 'react'
import { Box, VStack, Text, Pressable } from 'native-base'
import UploadIcon from '~assets/svg/wallet-upload.svg'

type Props = {
  onPress: () => void
  label?: string
}

const WAlletFileBtn = ({ onPress, label }: Props) => {
  return (
    <Box>
      {label ? <Text mb="6px">{label}</Text> : null}

      <Pressable
        borderColor="#BBBFC4"
        borderWidth={1}
        borderRadius="4px"
        paddingY="16px"
        alignItems="center"
        flexDirection="row"
        paddingX="10px"
        borderStyle="dashed"
        onPress={onPress}>
        <Box
          backgroundColor="#F1FDEB"
          width="36px"
          height="36px"
          borderRadius="18px"
          justifyContent="center"
          alignItems="center">
          <UploadIcon color="#62A446" width={24} height={24} />
        </Box>
        <VStack ml="20px">
          <Text fontSize="14px" color="#253545" mb="2px">
            Upload file
          </Text>
          <Text mt="2px">Accepts jpg and png</Text>
        </VStack>
      </Pressable>
    </Box>
  )
}

export default WAlletFileBtn
