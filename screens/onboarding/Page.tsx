import React from 'react'
import { SvgProps } from 'react-native-svg'
import { Box, VStack, Text, Heading, Image } from 'native-base'
import { Dimensions } from 'react-native'
import { getHeight } from './Slide'
type PageProps = {
  imageKey: number | string
  title: string
  description: string
  WelcomeImage: any
  imageHeight: number
}

const { width, height } = Dimensions.get('screen')

const headerSectionHeight = (120 / 884) * height

const Page = ({
  imageKey,
  title,
  description,
  WelcomeImage,
  imageHeight,
}: PageProps) => {
  console.log(imageKey, 'key')
  const imageSectionHeight = imageHeight - headerSectionHeight
  return (
    <VStack>
      <Box
        height={getHeight(439)}
        // position={'absolute'}
      >
        <Image
          source={WelcomeImage}
          alt="Welcome Image"
          width={width}
          height={getHeight(439)}
          mt={imageKey == 2 ? getHeight(4) : '0px'}
        />
      </Box>
      <Box paddingX={'16px'} height={getHeight(131)}>
        <Heading
          textAlign="center"
          lineHeight={'41px'}
          color={'charcoal'}
          fontSize={'24px'}>
          {title}
        </Heading>
        <Text
          textAlign="center"
          color={'grey'}
          fontSize={'16px'}
          lineHeight={'24px'}
          mt="8px">
          {description}
        </Text>
      </Box>
    </VStack>
  )
}

export default Page
