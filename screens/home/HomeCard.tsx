import { Dimensions, ImageBackground } from 'react-native'
import React from 'react'
import { Box, Text, Button, HStack, Pressable } from 'native-base'
import { useFetchProfile } from '~api/home'
import { useNavigation } from '@react-navigation/native'
import { AccountsRoutes, TARoutes } from '~types'
import UserAvatar from '~components/UserAvatar'
import { useMyProfile } from '~api/account'
import ClockInOutBtns from './ClockInOutBtns'
import { useAccountSettings, useEnabledFeatures } from '~api/settings'
import { analyticsTrackEvent } from '~utils/analytics'
import { AnalyticsEvents } from '~utils/analytics/events'
import { isFeatureEnabled } from '~utils/hooks/useMenuItems'

const HomeCard = () => {
  const navigation = useNavigation()
  const { data } = useFetchProfile()
  const { data: profile } = useMyProfile()
  const { data: settingData } = useAccountSettings()
  const { data: featuresData } = useEnabledFeatures()

  const enabledFeatures = featuresData?.data?.data ?? []
  const hasTa = Boolean(settingData?.data?.allow_portal_clockin)

  const taAvailable =
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures)

  const TAButtons = () => {
    const navigateToTA = () => {
      navigation.navigate(TARoutes.TA)
      analyticsTrackEvent(AnalyticsEvents.Home.view_attempts, {})
    }

    return (
      <Box width="100%" flex={1}>
        <Box mt="30px" />
        <ClockInOutBtns />
        <Pressable onPress={navigateToTA}>
          <Text alignSelf="center" color="green.70" fontSize={'16px'}>
            View attempts
          </Text>
        </Pressable>
      </Box>
    )
  }
  return (
    <Box
      borderWidth={'1px'}
      borderColor={'#FCFAFA'}
      borderRadius={'18px'}
      mt={'31px'}>
      <Box
        overflow={'hidden'}
        borderRadius={'18px'}
        // shadowColor={'#000'}
        shadow={10}
        borderWidth={'3px'}
        borderColor={'white'}
        height={hasTa ? '200px' : '198px'}
        style={{ shadowColor: 'rgba(224,191,191, 1)' }}
        background={'rgba(224,191,191, 0.25)'}>
        <ImageBackground
          source={require('../../assets/images/mask-group-1.png')}
          blurRadius={5}
          style={{
            height: '100%',
            top: 0,
          }}>
          <Box
            // borderRadius={1}
            // paddingLeft="16px"
            padding={'16px'}
            width={'100%'}
            height={'100%'}
            position="absolute"
            bg={{
              linearGradient: {
                colors: ['rgba(242,243,243, 0.5)', 'rgba(238,245,235, 0.5)'],
                start: [0, 0],
                end: [0, 0],
              },
            }}>
            {/* <Box>
              <UserAvatar
                width="64px"
                height="64px"
                fallback="KB"
                url={profile?.data?.profile_picture}
              />
            </Box> */}
            <Box
              marginTop="8px"
              alignItems={'center'}
              justifyContent={'center'}>
              {/* <Text
                fontSize="20px"
                fontWeight="bold"
                fontFamily="heading"
                lineHeight={'24px'}
                color="charcoal"
                marginY="1px">
                {data?.data?.full_names ?? '-'}
              </Text> */}
              <Text
                color="charcoal"
                fontSize="16px"
                mt={'8px'}
                lineHeight={'19px'}>
                {profile?.data?.designation_name ?? '-'}
              </Text>
              <Text
                color="green.70"
                marginTop="8px"
                fontSize={'16px'}
                lineHeight={'19px'}>
                {data?.data?.company_name ?? '-'}
              </Text>
            </Box>
            {taAvailable && hasTa ? (
              <TAButtons />
            ) : (
              <Box flex={1}>
                <Button
                  // variant={'outlined'}
                  onPress={() => navigation.navigate(AccountsRoutes.Profile)}
                  background={'transparent'}
                  borderWidth="1px"
                  borderColor="green.70"
                  width="100%"
                  mt={'auto'}
                  _text={
                    {
                      fontFamily: 'heading',
                      fontSize: '16px',
                      color: 'green.70',
                    } as any
                  }
                  height={'48px'}>
                  My Profile
                </Button>
              </Box>
            )}
          </Box>
        </ImageBackground>
      </Box>
    </Box>
  )
}

export default HomeCard
