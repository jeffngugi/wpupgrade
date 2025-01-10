import { Box, ScrollView, Text, Image } from 'native-base'
import React from 'react'
import EwaHomeCardInfo from './components/EwaHomeCardInfo'

import FavouritesEwa from './components/FavouritesEwa'
import { useEwaEarning } from '~api/ewa'
import LoaderScreen from '~components/LoaderScreen'
import { useMyProfile } from '~api/account'
import { ImageBackground, View } from 'react-native'
import { useWalletStatus } from '~screens/wallet/hooks/useWalletStatus'

const EwaHome = () => {
  const { isLoading } = useEwaEarning()
  const { isLoading: loading } = useMyProfile()
  useWalletStatus()

  if (isLoading || loading) return <LoaderScreen />

  return (
    <ScrollView
      paddingLeft="20px"
      paddingRight="12px"
      paddingTop="38px"
      background={'white'}
      flex="1">
      <Box>
        <Box
          borderWidth={'1px'}
          borderColor={'#FCFAFA'}
          borderRadius={'18px'}
          background={'white'}>
          <Box
            overflow={'hidden'}
            borderRadius={'18px'}
            // shadowColor={'#000'}
            // shadow={4}
            borderWidth={'3px'}
            borderColor={'white'}
            style={{ shadowColor: 'rgba(224,191,191, 1)' }}
            background={'rgba(224,191,191, 0.25)'}>
            <ImageBackground
              source={require('../../assets/images/mask-group-1.png')}
              blurRadius={6}
              style={{
                height: 350,
                top: 0,
              }}>
              <EwaHomeCardInfo />
            </ImageBackground>
          </Box>
        </Box>
        {/* </ImageBackground> */}
        <FavouritesEwa />
        <Box mt={'80px'} />
      </Box>
    </ScrollView>
  )
}

export default EwaHome
