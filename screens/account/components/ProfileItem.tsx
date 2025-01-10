import React from 'react'
import { Pressable, Text, HStack, Divider } from 'native-base'
import RightChev from '../../../assets/svg/chev-right.svg'
import { useNavigation } from '@react-navigation/native'
import { useCanEditAccount } from '~utils/hooks/useCanEditAccount'
import { dateToString } from '~utils/date'

type Props = {
  label: string
  value: string
  route?: string
}

const ProfileItem = ({ item, index }: { item: Props; index: number }) => {
  const navigation = useNavigation()
  const handleNavigation = () => {
    navigation.navigate(item.route)
  }
  const canEdiBioData = useCanEditAccount('update_bio_data')

  return (
    <>
      <Pressable
        isDisabled={!item.route || !canEdiBioData}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingY="20px"
        onPress={handleNavigation}
        key={index.toString()}>
        <Text fontSize="14px" color={'grey'}>
          {item.label}
        </Text>
        <HStack alignItems="center">
          <Text color="charcoal" fontSize="16px" marginRight="14px">
            {item.label === 'Date of birth'
              ? dateToString(item.value, 'do MMM, yyyy')
              : item.value}
          </Text>
          {item.route ? (
            <RightChev color={canEdiBioData ? '#62A446' : 'transparent'} />
          ) : null}
        </HStack>
      </Pressable>
      <Divider />
    </>
  )
}

export default ProfileItem
