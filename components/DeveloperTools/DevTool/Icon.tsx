import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'

import { DeveloperTool } from '~declarations'

type IconProps = {
  label: DeveloperTool
}
const Icon = ({ label }: IconProps) => {
  if (label === 'environment') {
    return <MaterialCommunityIcons name="api" size={24} />
  } else if (label === 'language') {
    return <Ionicons name="language" size={24} />
  } else {
    return null
  }
}

export default Icon
