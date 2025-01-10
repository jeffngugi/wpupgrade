import React from 'react'
import {
  HStack,
  Heading,
  VStack,
  Circle,
  Text,
  Box,
  Divider,
  Pressable,
  Badge,
} from 'native-base'
import { getHowLongAgo } from '~utils/date'

type NotificationCardProps = {
  item: {
    id: number
    title: string
    message: string
    created_at: string
  }
}

const NotificationCard = ({ item }: NotificationCardProps) => {
  return (
    <Pressable my="16px">
      <HStack mb="14px" px="16px">
        <Circle
          backgroundColor={'amber.50'}
          width="39px"
          height="39px"
          mr="10px"
        />
        <VStack px={'16px'}>
          <HStack justifyContent="space-between">
            <Heading
              fontSize="20px"
              color="charcoal"
              fontFamily="body"
              lineHeight={'24px'}>
              {item?.title}
            </Heading>
          </HStack>
          <Box maxW={'96%'}>
            <Text color="#536171" fontSize="14px" mt="10px" lineHeight="20px">
              {item?.message}.{' '}
            </Text>
          </Box>
          <Badge
            variant="subtle"
            colorScheme="amber"
            mt="8px"
            ml="auto"
            mr="8px">
            {getHowLongAgo(item?.created_at)}
          </Badge>
        </VStack>
      </HStack>
      <Divider />
    </Pressable>
  )
}

export default NotificationCard
