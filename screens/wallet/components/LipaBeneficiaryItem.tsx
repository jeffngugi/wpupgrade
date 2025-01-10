import React from 'react'
import { Pressable, Box, Text } from 'native-base'
import { contactColors } from '~constants/Colors'

type Props = {
  onPress: () => void
  AbrevTxt: string
  name: string
  accNo: string
  idx: number
}

const LipaBeneficiaryItem = (p: Props) => {
  return (
    <Pressable
      flexDirection="row"
      // alignItems="center"
      marginY="8px"
      onPress={p.onPress}>
      <Box
        width="40px"
        height="40px"
        borderRadius="20px"
        backgroundColor={contactColors[p.idx % contactColors.length]}
        alignItems="center"
        justifyContent="center">
        <Text fontSize="16px">{p.AbrevTxt}</Text>
      </Box>
      <Box ml="13px" marginRight="auto">
        <Text lineHeight="24px" fontSize="16px" color="charcoal">
          {p.name}
        </Text>
        <Text lineHeight="22px" color="grey">
          {p.accNo}
        </Text>
      </Box>
    </Pressable>
  )
}

export default LipaBeneficiaryItem
