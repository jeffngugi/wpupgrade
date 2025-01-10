import {
  RefreshControl,
  Animated,
  View,
  StyleSheet,
  ScrollView as ScrollT,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Box, Heading, HStack, Text, ScrollView} from 'native-base';
import HomeCard from './HomeCard';
import QuickActions from './QuickActions';
import UpcomingEvents from './UpcomingEvents';
import OutToday from './OutToday';
import {useFetchProfile} from '~api/home';
import {CustomStatusBar} from '~components/customStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {isString} from 'lodash';
import {useStatusBarBackgroundColor} from '~hooks/useStatusBarBackground';
import {useSalutation} from '~hooks/useSalutation';
import {useLocation} from '~hooks/useLocation';
import {LocationObject} from 'expo-location';
import {colors} from '~theme/foundations/colors';
import {useNotifications} from '~utils/notifications/useNotifications';
import {useMyProfile} from '~api/account';
import {useAccountSettings, useEnabledFeatures} from '~api/settings';
import {isFeatureEnabled} from '~utils/hooks/useMenuItems';
import ShowMoreBtn from '~components/ShowMoreBtn';
import {useTranslation} from 'react-i18next';

const Home = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [_, setRefechingUpcoming] = React.useState(false);
  const [__, setRefechingOutToday] = React.useState(false);
  const {data: settingData} = useAccountSettings();
  const {data: featuresData} = useEnabledFeatures();
  const {t} = useTranslation('home');
  const [showButton, setShowButton] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const refetchUpcoming = useRef<any>(null);
  const refetchOutToday = useRef<any>(null);

  const onRefresh = React.useCallback(() => {
    if (refetchUpcoming.current) {
      refetchUpcoming.current.refetch();
    }
    if (refetchOutToday.current) {
      refetchOutToday.current.refetch();
    }
  }, []);

  const {data} = useFetchProfile();
  useMyProfile();
  let position: LocationObject | null = null;
  useStatusBarBackgroundColor('#F6FFF2');
  useNotifications();
  const {requestPosition} = useLocation();

  const firstName = isString(data?.data?.name)
    ? data?.data?.name.split(' ')[0]
    : '';

  const handleGetLocation = async () => {
    position = await requestPosition();
  };

  useEffect(() => {
    if (position === null) {
      handleGetLocation();
    }
  }, []);

  const hasTa = Boolean(settingData?.data?.allow_portal_clockin);
  const enabledFeatures = featuresData?.data?.data ?? [];

  const taAvailable =
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures) ||
    isFeatureEnabled('attendance-general', enabledFeatures);

  const {salutation, greetings} = useSalutation(firstName);
  const spacerHeight = 1000;
  const ref = useRef<ScrollT>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 15;

    if (isCloseToBottom && showButton) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowButton(false);
    } else if (!isCloseToBottom && !showButton) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setShowButton(true);
    }
  };

  const scrollToBottom = () => {
    ref.current?.scrollToEnd({animated: true});
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="#F6FFF2" />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={ref}
        showsVerticalScrollIndicator={false}
        bounces={true}
        background={'white'}
        flex={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={'green'}
            zIndex={100}
          />
        }
        alwaysBounceVertical={false}>
        <View
          style={{
            backgroundColor: colors.greenHeaderBackground,
            height: spacerHeight,
            position: 'absolute',
            top: -spacerHeight,
            left: 0,
            right: 0,
          }}
        />
        <Box
          paddingX="16px"
          pb={'12px'}
          pt={'12px'}
          backgroundColor="greenHeaderBackground">
          <HStack justifyContent="space-between">
            <Box>
              <Heading color="#253545" fontSize="20px">
                {greetings}
              </Heading>
              <Text fontSize="16px" color={'grey'}>
                {salutation}
              </Text>
            </Box>
          </HStack>
          {/* {taAvailable && hasTa ? <HomeCard /> : null} */}
        </Box>
        <Box
          paddingX="16px"
          paddingTop={taAvailable && hasTa ? '5px' : '10px'}
          background={'white'}>
          <QuickActions />
          <UpcomingEvents
            setRefetching={setRefechingUpcoming}
            ref={refetchUpcoming}
          />
          {isFeatureEnabled('leaves', enabledFeatures) ? (
            <OutToday
              setRefetching={setRefechingOutToday}
              ref={refetchOutToday}
            />
          ) : null}
        </Box>
      </ScrollView>
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
        pointerEvents={showButton ? 'auto' : 'none'}>
        <ShowMoreBtn onPress={scrollToBottom} label={t('scrollMore')} />
      </Animated.View>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButtonContainer: {
    marginRight: 'auto',
    marginLeft: 'auto',
    zIndex: 1000,
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
});
