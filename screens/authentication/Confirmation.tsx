import React from 'react'
import { Box, Button, Heading, Text } from 'native-base'
import ConfirmPassIcon from '../../assets/svg/pass-change.svg'
import { AuthStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmPassword'>

const Confirmation = ({ navigation }: Props) => {
  return (
    <Box safeArea flex={1} backgroundColor="white" paddingX="24px">
      <Box flex={1} justifyContent="center" alignItems="center">
        <ConfirmPassIcon />
        <Heading textAlign="center" marginTop={'40px'} fontSize={'24px'}>
          Your password has been changed
        </Heading>
      </Box>
      <Button
        onPress={() => navigation.navigate('Login')}
        marginBottom={'32px'}>
        <Text
          color="white"
          marginY="4px"
          fontSize={'16px'}
          fontFamily={'heading'}>
          Login
        </Text>
      </Button>
    </Box>
  )
}

export default Confirmation
