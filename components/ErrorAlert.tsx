import React from 'react'
import { Alert, VStack, HStack, Text } from 'native-base'
import { FormattedMessage } from 'react-intl'

type Props = {
  description: string
  error?: 'error' | 'success' | 'warning' | 'info'
  title?: string
}
const ErrorAlert = ({ title, description, error }: Props) => {
  return (
    <Alert
      marginX="16px"
      alignSelf="center"
      flexDirection="row"
      status={error ?? 'warning'}
      backgroundColor={error === 'error' ? 'red.30' : 'chrome.30'}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text fontWeight="medium" flexShrink={1} color="black">
              {title ? (
                <Text>{title}</Text>
              ) : (
                <FormattedMessage id="alert_messages.something_wrong" />
              )}
            </Text>
          </HStack>
        </HStack>
        <Text px="6" fontSize="sm">
          {description}
        </Text>
      </VStack>
    </Alert>
  )
}

export default ErrorAlert
