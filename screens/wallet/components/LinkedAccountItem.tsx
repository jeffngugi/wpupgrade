import React from 'react'
import { Box, Pressable, Text } from 'native-base'
import EclipseIcon from '~assets/svg/eclipse.svg'
import MoreICon from '~assets/svg/more-vertical.svg'
import { TLinkedAccount } from '~types'

type Props = {
  item: TLinkedAccount
  handlePress: () => void
}

const LinkedAccountItem = ({ item, handlePress }: Props) => {
  const transferType =
    item?.channel !== 'BANK_TRANSFER'
      ? 'Mobile Transfer'
      : item?.bank?.name ?? '-'
  return (
    <Pressable
      flexDirection="row"
      alignItems="center"
      marginY="8px"
      onPress={handlePress}>
      <EclipseIcon />
      <Box ml="13px" marginRight="auto">
        <Text lineHeight="24px" fontSize="16px" color="charcoal">
          {transferType}
        </Text>
        <Text lineHeight="22px" color="grey">
          {item.acc_name ?? '-'} | {item?.acc_no ?? '-'}
        </Text>
      </Box>
      <MoreICon color="#003049" />
    </Pressable>
  )
}

export default LinkedAccountItem
