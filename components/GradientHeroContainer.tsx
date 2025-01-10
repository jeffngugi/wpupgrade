import { Box } from 'native-base'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const GradientHeroContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box borderWidth="3px" borderColor="white" borderRadius="6px">
      <LinearGradient
        colors={['#DBE6F5', '#EEF5EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 6 }}>
        {children}
      </LinearGradient>
    </Box>
  )
}

export default GradientHeroContainer
