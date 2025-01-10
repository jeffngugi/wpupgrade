import { useNavigation } from '@react-navigation/native'
import { HStack, Pressable, Text, Circle, Divider } from 'native-base'
import React from 'react'
import { DocumentRoutes } from '~types'
import { dateToString } from '~utils/date'

export type TDocItem = {
  id: number
  name: string
  path: string
  type: string
  external_id: number
  external_type: string
  company_id: number
  created_at: string
  updated_at: string
  notes: string
  document_category_id: number
}

const DocumentCard = ({ item }: { item: TDocItem }) => {
  const navigation = useNavigation()
  const modifiedAt = dateToString(item.updated_at, 'd MMM y') ?? '-'
  return (
    <Pressable
      mt="20px"
      onPress={() =>
        navigation.navigate(DocumentRoutes.Details, {
          document: item,
        })
      }>
      <Text color="charcoal" fontSize="16px">
        {item.name ?? '-'}
      </Text>
      <HStack alignItems="center" mb="20px" mt={'6px'}>
        <Text color={'grey'} fontSize={'14px'}>
          {item.type ?? '-'}
        </Text>
        <Circle size="4px" bgColor="grey" mx="4px"></Circle>
        <Text color={'grey'} fontSize={'14px'}>
          Modified at {modifiedAt}
        </Text>
      </HStack>
      <Divider width="75%" alignSelf="flex-end" />
    </Pressable>
  )
}

export default DocumentCard
