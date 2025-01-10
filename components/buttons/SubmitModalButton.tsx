import { Button, Spinner, Text } from 'native-base'
import React from 'react'

type SubmitButtonProps = {
  onPress: () => void
  loading?: boolean
  title: string
  disabled?: boolean
}

function SubmitModalButton({
  onPress,
  loading,
  title,
  disabled,
  ...rest
}: SubmitButtonProps) {
  return (
    <Button onPress={onPress} {...rest} isDisabled={disabled}>
      {loading ? (
        <Spinner color={'white'} />
      ) : (
        <Text fontFamily={'heading'} color={'white'} fontSize={'16px'}>
          {title}
        </Text>
      )}
    </Button>
  )
}

export default SubmitModalButton
