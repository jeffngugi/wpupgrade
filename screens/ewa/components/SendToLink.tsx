import React from 'react'
import { Box, Text, Pressable, Badge } from 'native-base'
import { SvgProps } from 'react-native-svg'
import RightChev from '../../../assets/svg/chev-right.svg'

type Props = {
  onPress: () => void
  title: string
  label: string
  Icon: React.FC<SvgProps>
  comingSoon?: boolean
}

const SendToLink = ({ onPress, title, label, Icon, comingSoon }: Props) => {
  return (
    <Pressable
      alignItems="center"
      flexDirection="row"
      my="16px"
      onPress={onPress}
      marginRight="16px">
      <Icon />
      <Box ml="16px" flex={1}>
        <Text fontSize="16px" color="navy.50">
          {title}
        </Text>
        <Text color={'grey'} fontSize={'14px'}>
          {label}
        </Text>
      </Box>
      <Box alignSelf="center">
        {comingSoon ? (
          <Badge variant="pending">Coming soon</Badge>
        ) : (
          <RightChev color="#536171" />
        )}
      </Box>
    </Pressable>
  )
}

export default SendToLink
