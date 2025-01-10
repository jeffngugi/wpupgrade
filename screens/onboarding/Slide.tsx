import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { AuthStackScreenProps } from '../../types'
import { Box, Button, Image, Text, VStack } from 'native-base'
import { setItem } from '~storage/device-storage'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { SvgProps } from 'react-native-svg'
import Bg1 from '../../assets/svg/slide-1.svg'
import Bg2 from '../../assets/svg/slide-2.svg'
import Bg3 from '../../assets/svg/slide-3.svg'
import Page from './Page'
import Footer from './Footer'
import Dot from './Dot'
import { OnboardingAction } from '~declarations'
import { setOnboarded } from '~store/actions/Onboarding'

const Image1 = '../../assets/images/slide-1.png'
const Image2 = '../../assets/images/slide-2.png'
const Image3 = '../../assets/images/slide-3.png'

export interface PageInterface {
  title: string
  description: string
  WelcomeImg: string
}

export interface PageControlRef {
  didSelectPage: (index: number) => void
}
const deviceHeight = Dimensions.get('screen').height
export const SLIDER_DATA: PageInterface[] = [
  {
    title: 'Welcome to the Workpay Family!',
    description:
      'Say Hello 😀 to a refreshingly easy way to  stay connected with work!',
    WelcomeImg: require(Image1),
  },
  {
    title: 'Working together on the go!',
    description:
      'Get real-time updates about the work that matters most to you.',
    WelcomeImg: require(Image2),
  },
  {
    title: 'All your work documents in one place',
    description:
      'Take charge of your work, payroll and compliance data on your hands.',
    WelcomeImg: require(Image3),
  },
]

const { width, height } = Dimensions.get('screen')
const swiperHeight = (570 / 884) * height
const topMargin = (50 / 884) * height

export const getHeight = (height: number) => {
  return (height / 884) * deviceHeight
}

const Slide = ({ navigation }: AuthStackScreenProps<'Slider'>) => {
  const dispatch: Dispatch<OnboardingAction> = useDispatch()
  const initial = 0
  const [currentPage, setCurrentPage] = useState(initial)
  const pageRef = useRef<PagerView>(null)
  const pageControlRef = useRef<PageControlRef>(null)

  function onPageSelected(e: PagerViewOnPageSelectedEvent) {
    setCurrentPage(e.nativeEvent.position)
    pageControlRef.current?.didSelectPage(e.nativeEvent.position)
  }

  const handleOnboard = async () => {
    dispatch(setOnboarded())
    await setItem('isOnboarded', 'onboarded')
  }

  const handleToLogin = () => {
    handleOnboard()
  }

  const handleNext = async () => {
    if (currentPage === 2) {
      handleOnboard()
    } else {
      pageRef.current?.setPage(currentPage + 1)
    }
  }

  const handleBack = async () => {
    pageRef.current?.setPage(currentPage - 1)
  }

  let bgColor = '#F0FBEA'
  if (currentPage == 0) {
    bgColor = '#F0FBEA'
  } else if (currentPage == 1) {
    bgColor = '#FEF9F1'
  } else if (currentPage == 2) {
    bgColor = '#F0F4F9'
  }

  return (
    <Box safeArea backgroundColor={bgColor} flex={1}>
      <Box mt={topMargin} height={getHeight(600)}>
        <PagerView
          style={styles.pagerView}
          initialPage={initial}
          ref={pageRef}
          onPageSelected={onPageSelected}>
          {SLIDER_DATA.map((item, index) => (
            <Page
              key={index.toString()}
              imageKey={index}
              title={item.title}
              description={item.description}
              WelcomeImage={item.WelcomeImg}
              imageHeight={swiperHeight}
            />
          ))}
        </PagerView>
        <Box position={'absolute'} top={-getHeight(30)} right={'17px'}>
          {currentPage < 2 ? (
            <TouchableOpacity
              onPress={handleToLogin}
              style={{
                backgroundColor: '#D6F1CA',
                width: 64,
                height: getHeight(32),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 6,
              }}>
              <Text fontFamily={'heading'} fontSize={'16px'} color={'green.50'}>
                Skip
              </Text>
            </TouchableOpacity>
          ) : null}
        </Box>
      </Box>

      <Box mt={getHeight(30)}>
        <VStack alignSelf="center" flexDirection="row">
          {SLIDER_DATA.map((_, index) => {
            return (
              <Dot
                key={index.toString()}
                index={index}
                currentPage={currentPage}
              />
            )
          })}
        </VStack>
      </Box>

      <Box position={'absolute'} bottom={getHeight(40)} w={'full'}>
        <Footer
          onNext={handleNext}
          onBack={handleBack}
          currentPage={currentPage}
          bgColor={bgColor}
          toLogin={handleToLogin}
        />
      </Box>
    </Box>
  )
}

export default Slide

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  skipBtn: {
    backgroundColor: '#D6F1CA',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    // position: 'absolute',
    right: 19,
    top: 24,
  },
  skipTxt: {
    color: '#62A446',
  },
})
