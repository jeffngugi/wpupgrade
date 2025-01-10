import React from 'react'
import { Alert, VStack, HStack, Text } from 'native-base'
import { FormattedMessage } from 'react-intl'

type Props = {
  description: string
}
const SuccessAlert = ({ description }: Props) => {
  return (
    <Alert
      maxWidth="98%"
      alignSelf="center"
      flexDirection="row"
      status="success"
      backgroundColor="green.20">
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text fontWeight="medium" flexShrink={1} color="black">
              <FormattedMessage id="alert_messages.success" />
            </Text>
          </HStack>
        </HStack>
        <Text px="6" color="gray" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Alert>
  )
}

export default SuccessAlert
