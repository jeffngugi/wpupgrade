import React from 'react'
import { Box, FlatList, Heading, HStack, Pressable, Text } from 'native-base'
import FavStar from '../../../assets/svg/fav-star.svg'
import { useEwaBeneficiaries } from '~api/ewa'
import { useNavigation } from '@react-navigation/native'
import {
  EwaRoutes,
  EwaSendMethods,
  MainNavigationProp,
  TEwaFavourite,
} from '~types'

const FavouritesEwa = () => {
  const navigation = useNavigation<MainNavigationProp<EwaRoutes.Ewa>>()
  const { data, isLoading } = useEwaBeneficiaries()
  const loading = false
  const favColors = ['#41C2FE', '#3AAE2A', '#DE350B', '#387E1B']
  const favData = data?.data?.data

  const NoFav = () => {
    return (
      <HStack alignItems="center">
        <FavStar />
        <Box mx="14px">
          <Text fontSize="16px" color={'charcoal'} width={'70%'}>
            Add your favourites to make quick easy transactions.
          </Text>
        </Box>
      </HStack>
    )
  }

  const FavItem = ({ item, index }: { item: TEwaFavourite; index: number }) => {
    const chars: string = item?.name ? item.name.slice(0, 2) : '-'

    const handleToMpesa = () => {
      navigation.navigate(EwaRoutes.SendMoney, {
        ewaSendMethod: EwaSendMethods.mpesa,
        item: item,
      })
    }

    const handleToBank = () => {
      navigation.navigate(EwaRoutes.SendMoney, {
        ewaSendMethod: EwaSendMethods.bank,
        item: item,
      })
    }

    const handlePress = () => {
      item?.payment_method === 'bank' ? handleToBank() : handleToMpesa()
    }

    return (
      <Pressable marginRight="30px" alignItems="center" onPress={handlePress}>
        <Box
          width="48px"
          height="48px"
          backgroundColor={favColors[index % favColors.length]}
          alignItems="center"
          justifyContent="center"
          borderRadius="24px">
          <Heading fontSize="16px" color="white">
            {chars.toUpperCase()}
          </Heading>
        </Box>
        <Text alignSelf="center">
          {item?.name ? item?.name.split(' ')[0] : '-'}
        </Text>
      </Pressable>
    )
  }
  if (isLoading) return <Box />

  return (
    <Box paddingTop="40px">
      <Heading fontSize="20px" marginBottom="20px">
        Favourites
      </Heading>
      {loading ? (
        <Text>Loading Favourites</Text>
      ) : favData.length < 1 ? (
        <NoFav />
      ) : (
        <FlatList
          data={favData}
          renderItem={FavItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </Box>
  )
}

export default FavouritesEwa
