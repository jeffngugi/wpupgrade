import React from 'react'
import { Box, HStack, Heading, Pressable, Text } from 'native-base'
import { SvgProps } from 'react-native-svg'
import CopyIcon from '~assets/svg/Copy.svg'

type Props = {
  title: string
  subTitle: string
  Icon: React.FC<SvgProps>
  onPress: () => void
  onPressCopy?: () => void
}

const WalletHomeHeader = ({
  title,
  subTitle,
  Icon,
  onPress,
  onPressCopy,
}: Props) => {
  return (
    <HStack justifyContent="space-between" paddingY={3}>
      <Box>
        <Heading
          color="#253545"
          fontSize="24px"
          fontWeight="bold"
          fontFamily={'heading'}>
          {title}
        </Heading>

        <Pressable onPress={onPressCopy}>
          <HStack>
            <Text
              fontSize="16px"
              color="charcoal"
              fontFamily={'body'}
              mr={'4px'}>
              {subTitle}
            </Text>
            {onPressCopy ? <CopyIcon color="#62A446" /> : null}
          </HStack>
        </Pressable>
      </Box>
      <Pressable onPress={onPress}>
        <Icon color="#253545" />
      </Pressable>
    </HStack>
  )
}

export default WalletHomeHeader
