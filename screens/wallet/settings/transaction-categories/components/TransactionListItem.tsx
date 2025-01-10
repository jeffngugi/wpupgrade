import React from 'react'
import { Pressable, Box, Text, Menu } from 'native-base'
import MoreICon from '~assets/svg/more-vertical.svg'
import ColorDot from '~components/ColorDot'

import { noop } from 'lodash'

export type TransactionCategoryItem = {
  id: string | number
  name?: string
  description: string
  colorCode: string
  Icon?: any
  uuid?: string
  color?: string
}

type Props = {
  item: TransactionCategoryItem
  handlePress: (type: string) => void
}

const TransactionCategoryListItem = ({ item, handlePress }: Props) => {
  const RightItem = () => (
    <Menu
      w="190"
      defaultIsOpen={false}
      trigger={triggerProps => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <MoreICon color="#253545" />
          </Pressable>
        )
      }}>
      <Menu.Item
        onPress={() => {
          handlePress('edit')
        }}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Edit
        </Text>
      </Menu.Item>
      <Menu.Item onPress={() => handlePress('delete')}>
        <Text fontFamily={'body'} fontSize={'16px'}>
          Delete
        </Text>
      </Menu.Item>
    </Menu>
  )

  return (
    <Pressable
      flexDirection="row"
      // paddingX="16px"
      alignItems="center"
      paddingY="20px"
      onPress={noop}>
      <>
        <Box>
          <ColorDot bgColor={item?.color} />
        </Box>

        <Box marginLeft="20px" mr={'auto'}>
          <Text fontSize="16px" color={'charcoal'}>
            {item?.name}
          </Text>
          <Text fontSize="14px" color="grey">
            {item?.description}
          </Text>
        </Box>

        <RightItem />
      </>
    </Pressable>
  )
}

export default TransactionCategoryListItem
