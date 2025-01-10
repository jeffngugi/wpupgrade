import React from 'react'
import { Pressable, Text, Box } from 'native-base'
import ChevDown from '~assets/svg/chev-down.svg'

const ShowMoreBtn = (p: { onPress: () => void; label: string }) => {
  return (
    <Pressable
      backgroundColor="chrome.50"
      borderRadius="16px"
      paddingY="4px"
      paddingX="11px"
      bottom="20px"
      flexDirection="row"
      alignItems="center"
      shadow="9"
      onPress={p.onPress}>
      <ChevDown color="#253545" />
      <Box width="4px" />
      <Text lineHeight="15px" fontSize="12px">
        {p.label}
      </Text>
    </Pressable>
  )
}

export default ShowMoreBtn
