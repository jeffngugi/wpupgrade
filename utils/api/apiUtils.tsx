// TOAST ON SUCCESS HANDLER
export const toastOnSuccess = ({
  response,
  position = 'top-right',
  duration = 8000,
  isClosable = true,
}) => {
  let description = ''
  let title = 'Let\'s try that again'
  let status = 'warning'

  if (response && response?.success) {
    description = response?.message
    title = 'Done'
    status = 'success'
  }

  description = response?.message

  toast({
    position,
    title,
    description,
    status,
    duration,
    isClosable,
    // variant: 'subtle',
  })
}

// TOAST ON ERROR HANDLER
export const toastOnError = ({
  error,
  position = 'top-right',
  duration = 8000,
  isClosable = true,
  message,
}) => {
  let description = message
  let title = 'Error'
  let status = 'error'

  // if (
  //   error &&
  //   typeof error?.response?.data?.message === 'string' &&
  //   typeof error?.response?.data?.data ===
  //     'object' /* Turns out null is of type object */ &&
  //   !isNull(error?.response?.data?.data) &&
  //   !error?.response?.data?.message?.includes('SQLSTATE')
  // ) {
  //   toast({
  //     position,
  //     title,
  //     render: () => (
  //       <Box color='white' p={3} bg='#F45B69' borderRadius='md'>
  //         <>
  //           <Text fontWeight='bold'>{error?.response?.data?.message}</Text>
  //           {Object.values(error?.response?.data?.data)?.map((msg, idx) => (
  //             <Text bg='chrome'>{`* ${msg}`}</Text>
  //           ))}
  //         </>
  //       </Box>
  //     ),
  //     status,
  //     duration,
  //     isClosable,
  //   });
  //   return null;
  // }

  if (error && typeof error?.response?.data?.message === 'string') {
    description = error.response.data?.message
    title = 'Warning'
    status = 'warning'
  }

  if (
    error &&
    typeof error?.response?.data?.message === 'object' &&
    error?.response?.data?.message !== null
  ) {
    toast({
      position,
      title,
      render: () => (
        <Box color="white" p={3} bg="#F45B69">
          {Object.values(error?.response?.data?.message)?.map((msg, idx) => (
            <HStack>
              <Text bg="wp-red" fontSize="bold">
                *
              </Text>
              <Text bg="wp-red">{msg}</Text>
            </HStack>
          ))}
        </Box>
      ),
      status,
      duration,
      isClosable,
    })
    return null
  }

  if (description && !description?.includes('SQLSTATE')) {
    toast({
      position,
      title,
      description,
      status,
      duration,
      isClosable,
    })
  }
  return null
}
