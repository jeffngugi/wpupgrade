import { Pressable } from 'native-base'
import React from 'react'
import DownloadSvg from '~assets/svg/download.svg'
import ExportSvg from '~assets/svg/export.svg'

type Props = {
  onPress: () => void
}
const DownloadBtn = ({ onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <DownloadSvg color="#253545" />
    </Pressable>
  )
}

export const ExportBtn = ({ onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <ExportSvg color="#253545" />
    </Pressable>
  )
}

export default DownloadBtn
