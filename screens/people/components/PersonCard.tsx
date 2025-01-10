import React from 'react'
import { Box } from 'native-base'
import PersonCardDetails from './PersonCardDetails'
import EwaCardBg from '../../../assets/svg/ewa-card-bg.svg'
import { TColleague } from '../types'
import { ImageBackground } from 'react-native'

const PersonCard = ({ item }: { item: TColleague }) => {
  return (
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
          source={require('../../../assets/images/mask-group-1.png')}
          blurRadius={6}
          style={{
            height: 257,
            top: 0,
          }}>
          <PersonCardDetails item={item} />
        </ImageBackground>
      </Box>
    </Box>
  )
}

export default PersonCard
