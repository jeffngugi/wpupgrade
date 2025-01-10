import { Box, ScrollView } from 'native-base'
import React from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import PersonCard from './components/PersonCard'
import MailIcon from '~assets/svg/mail.svg'
import PhoneIcon from '~assets/svg/phone.svg'
import PersonItem from './components/PersonItem'
import {
  MainNavigationProp,
  MainNavigationRouteProp,
  PeopleRoutes,
} from '~types'
import { useAccountSettings } from '~api/settings'

interface Props {
  navigation: MainNavigationProp<PeopleRoutes.Person>
  route: MainNavigationRouteProp<PeopleRoutes.Person>
}

const Person = ({ navigation, route }: Props) => {
  const { name, nationality, gender, email, phone } = route.params.person
  const { data: settingData } = useAccountSettings()

  const hidePhone = settingData?.data?.disable_phone_info
  return (
    <Box safeArea flex={1} backgroundColor="sea.10">
      <Box mx="16px">
        <ScreenHeader title={name ?? '-'} onPress={() => navigation.goBack()} />
      </Box>
      <Box h="22px"></Box>
      <ScrollView
        contentContainerStyle={{
          flexGrow: hidePhone ? 0 : 1,
          justifyContent: 'space-between',
        }}>
        <Box px="16px">
          <PersonCard item={route.params.person} />
        </Box>
        <Box
          backgroundColor="white"
          px="16px"
          pb="80px"
          marginTop={hidePhone ? '60px' : 0}>
          {hidePhone ? (
            <Box />
          ) : (
            <PersonItem
              label="Phone number"
              value={phone ?? '-'}
              copy
              phone
              icon={<PhoneIcon color="#62A446" />}
            />
          )}
          <PersonItem
            label="Personal Email"
            value={email ?? '-'}
            copy
            icon={<MailIcon color={'#62A446'} />}
          />
          <PersonItem label="Nationality" value={nationality ?? '-'} />
          <PersonItem label="Gender" value={gender ?? '-'} />
        </Box>
      </ScrollView>
    </Box>
  )
}

export default Person
