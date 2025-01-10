import React from 'react'
import { Box, Pressable, Text } from 'native-base'
import MoreICon from '~assets/svg/more-vertical.svg'
import { TLinkedAccount } from '~types'
import { contactColors } from '~constants/Colors'

type Props = {
  item: TLinkedAccount
  handlePress: () => void
  index: number
  editable?: boolean
}

const BeneficiaryItem = ({
  item,
  handlePress,
  index,
  editable = true,
}: Props) => {
  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      marginY="8px"
      onPress={handlePress}>
      <Box
        width="40px"
        height="40px"
        borderRadius="20px"
        backgroundColor={contactColors[index % contactColors.length]}
        alignItems="center"
        justifyContent="center">
        <Text fontSize="16px">AK</Text>
      </Box>
      <Box ml="13px" marginRight="auto">
        <Text lineHeight="24px" fontSize="16px" color="charcoal">
          {item?.name ?? '-'}
        </Text>
        <Text lineHeight="22px" color="grey">
          {item?.bank?.name ?? '-'} | {item?.acc_no ?? '-'}
        </Text>
      </Box>
      {editable ? <MoreICon color="#003049" /> : null}
    </Pressable>
  )
}

export default BeneficiaryItem
