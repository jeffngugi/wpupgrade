import React from 'react'
import { Box, Heading, HStack, Text } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import MoneyBag from '~/assets/svg/money-bag.svg'
import { SvgProps } from 'react-native-svg'
import { ImageBackground } from 'react-native'

type Props = {
  label: string
  value: string
  Icon: React.FC<SvgProps>
  color1?: string
  color2?: string
}

const ModuleHeroLeaveCard = ({ label, value, Icon, color1, color2 }: Props) => {
  return (
    <Box
      margin="20px"
      borderWidth="3px"
      borderColor="white"
      // borderRadius="6px"

      width={'317px'}
      background={'rgba(224,191,191, 0.25)'}>
      <LinearGradient
        colors={[color1 || '#F2F3F3', color2 || '#EEF5EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 6 }}>
        <HStack alignItems="center" marginX="10px">
          <Box
            width="68px"
            height="68px"
            backgroundColor="white"
            borderRadius="50px"
            marginY="20px"
            alignItems={'center'}
            justifyContent="center">
            {Icon ? <Icon /> : <MoneyBag />}
          </Box>
          <Box marginLeft="12px" maxWidth={'70%'}>
            <HStack>
              <Text fontFamily={'body'} fontSize={'14px'} color={'grey'}>
                {label}
              </Text>
            </HStack>
            <Heading fontSize="24px" color={'charcoal'}>
              {value}
            </Heading>
          </Box>
        </HStack>
      </LinearGradient>
    </Box>
  )
}

export default ModuleHeroLeaveCard
