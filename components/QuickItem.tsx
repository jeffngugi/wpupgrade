import React from 'react'
import { Pressable, Box, Text } from 'native-base'

export type TQuickItem = {
  label: string
  Icon: JSX.Element
  onPress: () => void
}

const QuickItem = ({ label, Icon, onPress }: TQuickItem) => (
  <Pressable alignItems={'center'} justifyContent={'center'} onPress={onPress}>
    <Icon />
    <Box>
      <Text textAlign="center" marginTop="2px" fontSize="14px">
        {label}
      </Text>
    </Box>
  </Pressable>
)

export default QuickItem
