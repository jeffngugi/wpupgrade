import React from 'react'
import { Box, Divider, Pressable, ScrollView, Text } from 'native-base'
import ScreenHeader from '../../components/ScreenHeader'
import ProfileItem from './components/ProfileItem'
import RightChev from '../../assets/svg/chev-right.svg'
import EditIcon from '../../assets/svg/edit.svg'
import { AccountsRoutes } from '../../types'
import ProfileHero from './components/ProfileHero'
import ContactItemHead from './components/ContactItemHead'
import ContactItem from './components/ContactItem'
import LoaderScreen from '~components/LoaderScreen'
import { useMyProfile } from '~api/account'
import { isNil, noop } from 'lodash'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { CustomStatusBar } from '~components/customStatusBar'
import { useCanEditAccount } from '~utils/hooks/useCanEditAccount'
import { useStatusBarBackgroundColor } from '~hooks/useStatusBarBackground'
import SwipableModal from '~components/modals/SwipableModal'
import { useFetchProfile } from '~api/home'

const ProfileScreen = ({ navigation }) => {
  const { data, isLoading: profileLoading } = useMyProfile()
  const { data: profileData, isLoading } = useFetchProfile()
  const [educationModal, setEducationModal] = React.useState<boolean>(false)

  const address = data?.data?.address
  const education = data?.data?.education
  const graduation_date = data?.data?.graduation_date
  const personalDatas = [
    {
      label: 'Full name',
      value: data?.data?.employee_name ?? '-',
    },
    {
      label: 'Date of birth',
      value: data?.data?.person?.dob ?? '-',
    },
    {
      label: 'Work email',
      value: address?.email ?? '-',
    },
    {
      label: 'Personal Email',
      value: address?.personal_email ?? '-',
      route: AccountsRoutes.EditEmail,
    },
    {
      label: 'Phone number',
      value: profileData?.data?.mobile_no ?? '-',
    },
    {
      label: 'Nationality',
      value: data?.data?.address?.citizenship ?? '-',
    },
    {
      label: 'Gender',
      value: data?.data?.person?.gender ?? '-',
    },
    {
      label: 'National ID Number',
      value: data?.data?.id_no ?? '-',
    },
  ]
  const closeActionSheets = () => {
    setEducationModal(false)
  }
  useStatusBarBackgroundColor('#F1FDEB')
  const userAddress =
    `${!isNil(address?.road) ? address?.road : ''} ${
      !isNil(address?.postal_address) ? address?.postal_address : ''
    } ${!isNil(address?.zip_code) ? address?.zip_code : ''} ${
      !isNil(address?.city) ? address?.city : ''
    } ${
      !isNil(address?.country_of_residence) ? address?.country_of_residence : ''
    }` ?? '-'

  const handleEditEducation = () => {
    closeActionSheets()
    navigation.navigate(AccountsRoutes.EditEducation)
  }

  const ItemsHeader = ({ title }: { title: string }) => (
    <>
      <Text
        fontSize="18px"
        color="charcoal"
        marginBottom="10px"
        fontFamily={'heading'}>
        {title}
      </Text>
      <Divider />
    </>
  )

  if (profileLoading || isLoading) return <LoaderScreen />
  const canEditBioData = useCanEditAccount('update_bio_data')
  const canEditEducation = useCanEditAccount('update_education_data')

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F1FDEB" />
      <Box flex={1} backgroundColor="white">
        <Box backgroundColor={'green.10'} paddingX="16px">
          <ScreenHeader title="Profile" onPress={() => navigation.goBack()} />
          <Box height={'24px'} />
          <ProfileHero />
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box paddingX="16px" paddingTop="24px">
            <ItemsHeader title="Personal Information" />
            {personalDatas.map((item, index) => (
              <ProfileItem item={item} index={index} key={index.toString()} />
            ))}
            <Box marginTop="40px" />
            <ItemsHeader title="Address" />
            <>
              <Pressable
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingY="20px"
                disabled={!canEditBioData}
                onPress={() => navigation.navigate(AccountsRoutes.EditAddress)}>
                <Text color="charcoal" fontSize={'16px'}>
                  {userAddress.trimStart() || '-'}
                </Text>
                <RightChev color={canEditBioData ? '#62A446' : 'transparent'} />
              </Pressable>
              <Divider />
            </>
            <Box my={'40px'}>
              <ContactItemHead
                onPress={() => navigation.navigate(AccountsRoutes.AddEducation)}
                title="Education Details"
                hidden={!canEditEducation || !isNil(education)}
              />
              {!isNil(education) && !isNil(graduation_date) ? (
                <ContactItem
                  name={education ?? '-'}
                  contact={graduation_date ?? '-'}
                  onPress={() => setEducationModal(true)}
                  edit={
                    !isNil(education) ||
                    !isNil(graduation_date) ||
                    !canEditEducation
                  }
                />
              ) : null}
            </Box>
          </Box>
        </ScrollView>
      </Box>
      <SwipableModal
        isOpen={educationModal}
        onHide={closeActionSheets}
        onBackdropPress={closeActionSheets}>
        <>
          <Box paddingX="16px" paddingBottom="60px" paddingTop={'10px'}>
            <Pressable
              flexDirection="row"
              alignItems="center"
              onPress={handleEditEducation}>
              <EditIcon color="#536171" />
              <Text
                color="charcoal"
                marginLeft="20px"
                fontFamily={'heading'}
                fontSize={'16px'}>
                Edit details
              </Text>
            </Pressable>
          </Box>
        </>
      </SwipableModal>
    </SafeAreaProvider>
  )
}

export default ProfileScreen
