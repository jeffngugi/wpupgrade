import React from 'react'
import { Avatar, Pressable, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { MainNavigationProp, PeopleRoutes } from '../../../types'
import { Dimensions } from 'react-native'
import { contactColors } from '~constants/Colors'
import { TColleague } from '../types'

const PersonTileCard = ({
  item,
  index,
}: {
  item: TColleague
  index: number
}) => {
  const { width } = Dimensions.get('screen')
  const navigation: MainNavigationProp<PeopleRoutes.Peoples> = useNavigation()

  return (
    <Pressable
      width={width * 0.45}
      alignItems="center"
      mb="18px"
      onPress={() =>
        navigation.navigate(PeopleRoutes.Person, { person: item })
      }>
      <Avatar
        width={width * 0.4}
        height={width * 0.4}
        backgroundColor={contactColors[index % contactColors.length]}
        source={{ uri: item.avatar }}>
        <Text fontSize={width * 0.18} color="white">
          {item?.name[0]}
        </Text>
      </Avatar>
      <Text fontSize="18px" color="charcoal" fontFamily={'heading'}>
        {item?.name ?? '-'}
      </Text>
      <Text fontSize={'14px'}>{item?.job_title ?? '-'}</Text>
    </Pressable>
  )
}

export default PersonTileCard
