import React from 'react'
import { Alert, VStack, HStack, Text } from 'native-base'
import { AxiosError } from 'axios'
import { isNull } from 'lodash'

type ErrorResponse = {
  message?: string
  data?: Record<string, unknown>
}

type Props = {
  error: AxiosError<ErrorResponse>
}

const AxiosErrorAlert: React.FC<Props> = ({ error }) => {
  const errorMessage = error?.response?.data?.message
  const errorData = error?.response?.data?.data

  const messageIsObject = typeof errorMessage === 'object'

  const isObjectErrors =
    error &&
    typeof errorMessage === 'string' &&
    typeof errorData === 'object' &&
    !isNull(errorData) &&
    !errorMessage.includes('SQLSTATE')



  return (
    <Alert
      marginX="16px"
      alignSelf="center"
      flexDirection="column"
      status="warning"
      backgroundColor="chrome.30">
      {messageIsObject ?
        Object.values(errorMessage).map((msg, idx) => (
          <Text key={idx.toString()} >{` - ${msg}`}</Text>
        ))
        :
        isObjectErrors ? (
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              alignItems="center"
              justifyContent="space-between">
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text fontWeight="medium" flexShrink={1} color="black">
                  {errorMessage ?? 'Something went wrong'}
                </Text>
              </HStack>
            </HStack>
            {Object.values(errorData).map((msg, idx) => (
              <Text key={idx.toString()}>{` - ${msg}`}</Text>
            ))}
          </VStack>
        ) : (
          <VStack space={1} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              alignItems="center"
              justifyContent="space-between">
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text fontWeight="medium" flexShrink={1} color="black">
                  Something went wrong
                </Text>
              </HStack>
            </HStack>
            <Text px="6" fontSize="sm">
              {errorMessage ?? 'Something went wrong, please try again later'}
            </Text>
          </VStack>
        )}
    </Alert>
  )
}

export default AxiosErrorAlert
