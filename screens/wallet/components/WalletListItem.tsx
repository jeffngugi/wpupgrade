import React from 'react'
import { Pressable, Box, Text } from 'native-base'
import ChevIcon from '~assets/svg/chev-r.svg'
import { SvgProps } from 'react-native-svg'
import { isString } from 'lodash'

type Props = {
  onPress: () => void
  Icon: React.FC<SvgProps>
  source: string
  description?: string
}

const WalletListItem = (p: Props) => {
  return (
    <Pressable
      flexDirection="row"
      marginX="20px"
      alignItems="center"
      marginY="20px"
      onPress={p.onPress}>
      <p.Icon color="#003049" />
      <Box ml="20px" width="70%" mr="auto">
        <Text lineHeight="24px" fontSize="16px" color="charcoal">
          {p.source}
        </Text>
        {isString(p.description ? <Text>{p.description}</Text> : null)}
      </Box>
      <ChevIcon color="#003049" />
    </Pressable>
  )
}

export default WalletListItem
