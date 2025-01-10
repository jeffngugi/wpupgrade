import { Pressable, Spinner, Text } from 'native-base'
import React from 'react'

type Props = {
  onPress: () => void
  loading?: boolean
}

const LoadMoreBtn = ({ onPress, loading }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      bgColor="green.20"
      py="14px"
      px="20px"
      my="30px"
      borderRadius="4px"
      alignSelf="center"
      isDisabled={loading}>
      {loading ? (
        <Spinner />
      ) : (
        <Text color="green.70" fontFamily={'heading'} fontSize={'16px'}>
          {loading ? 'Loading ....' : 'Load more'}
        </Text>
      )}
    </Pressable>
  )
}

export default LoadMoreBtn
