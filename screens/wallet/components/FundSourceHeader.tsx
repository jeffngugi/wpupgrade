import React from 'react'
import { Box, Text } from 'native-base'
import { SvgProps } from 'react-native-svg'

type Props = {
  source: string
  description: string
  Icon: React.FC<SvgProps>
}

const FundSourceHeader = ({ source, description, Icon }: Props) => {
  return (
    <Box alignItems="center" textAlign="center">
      <Box
        width="88px"
        height="88px"
        backgroundColor="green.20"
        borderRadius={'full'}
        alignItems="center"
        justifyContent="center">
        <Icon width={42} height={42} color="#62A446" />
      </Box>
      <Box px="20px" mt="16px">
        <Text lineHeight="24px" textAlign="center" color="charcoal">
          {source}
        </Text>
        <Text textAlign="center" lineHeight="22px" fontSize="14px" mt="4px">
          {description}
        </Text>
      </Box>
    </Box>
  )
}

export default FundSourceHeader
