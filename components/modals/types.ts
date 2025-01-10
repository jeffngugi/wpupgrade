import { FC, PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

export type CommonModalProps = {
  isVisible: boolean
  children: React.ReactNode
  hideModal: () => void
  onBackdropPress?: () => void
  noPadding?: boolean
  style?: StyleProp<ViewStyle>
}

export type fileUploadType = { uri: string; name: string } | undefined

export type UploadFilesProps =
  | {
      allowFiles: true
      setFile: (arg0: fileUploadType | undefined) => void
    }
  | { allowFiles?: never }

export type DocumentPickerModalProps = {
  onPressFile?: () => {}
  onPressCamera?: () => {}
  setPhotoURI: (arg1: string | null, arg2: 'image' | undefined) => void
  setPhotoItem?: (item: any) => void
  setFileItem?: (item: any) => void
  onUserCanceled: () => void
  showCamera?: true
} & Omit<CommonModalProps, 'children'> &
  UploadFilesProps

export type documentOption = {
  text: string
  onPress: () => void
  Icon: FC<SvgProps>
  key?: string
}

export type DocSelectionChoice = 'gallery' | 'camera' | 'file'

export type SwipeableModalProps = PropsWithChildren<{
  isOpen: boolean
  onHide: () => void
  onSwipeComplete?: () => void
  onBackdropPress?: () => void
  addTopOffset?: true
  androidScrollDisabled?: boolean
}>

export type DeleteModalProps = {
  title: string
  description: string
  onDelete: () => void
  btbLabel?: string
  closeIcon?: boolean
  loading?: boolean
} & Omit<CommonModalProps, 'children'>

export type ConfirmModalProps = {
  title: string
  description: string
  onConfirm: () => void
  btbLabel?: string
  closeIcon?: boolean
  loading?: boolean
} & Omit<CommonModalProps, 'children'>

export type WarningModalProps = {
  title: string
  description: string
} & Omit<CommonModalProps, 'children'>

export type TAStatusModalProps = {
  description: string
  onDelete: () => void
  btbLabel?: string
  closeIcon?: boolean
  loading?: boolean
  action?: 'success' | 'failed' | 'loading'
  usesQR: boolean
} & Omit<CommonModalProps, 'children'>
