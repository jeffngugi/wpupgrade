import React from 'react'
import { Avatar } from 'native-base'
import { ColorType } from 'native-base/lib/typescript/components/types'
import X from '../../assets/svg/x.svg'
import Tick from '../../assets/svg/tick.svg'
import Alert from '../../assets/svg/alert-triangle.svg'
import { capitalize } from 'lodash'

type StatusAvatarProps = {
  width?: number
  status?: 'Pending' | 'Fail' | 'Success' | 'Failed' | 'Proccessing' | string
  borderd?: boolean
  height?: number
}

const StatusAvatar = ({
  width,
  status,
  borderd,
  height,
}: StatusAvatarProps) => {
  const AvatarStatus = capitalize(status) ?? 'success'
  let AvatarIcon = Tick
  let bgColor: ColorType = '#EFF8E1'
  let Iconcolor: ColorType = '#93CE37'
  if (
    AvatarStatus === capitalize('fail') ||
    AvatarStatus === capitalize('Failed')
  ) {
    AvatarIcon = X
    status = 'Failed'
    bgColor = '#F4DCDA'
    Iconcolor = '#F14B3B'
  }
  if (AvatarStatus === 'Pending' || AvatarStatus === 'Processing') {
    AvatarIcon = Alert
    status = 'Pending'
    bgColor = '#FDF1DA'
    Iconcolor = '#F3B744'
  }

  return (
    <Avatar
      backgroundColor={bgColor}
      padding="10"
      borderWidth={borderd ? '1' : '0'}
      width={width || '40px'}
      height={height || '40px'}
      borderColor={Iconcolor}>
      <AvatarIcon color={Iconcolor} />
    </Avatar>
  )
}

export default StatusAvatar
