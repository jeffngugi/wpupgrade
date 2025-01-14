import { StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Camera, FlashMode } from 'expo-camera/legacy'

type Props = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onQrcodeScanned: (code?: string) => void
  torch: boolean
}

const ScanCamera = ({ children, style, onQrcodeScanned, torch }: Props) => {
  return (
    <Camera
      style={style}
      flashMode={torch ? FlashMode.torch : FlashMode.off}
      onBarCodeScanned={({ data }) => onQrcodeScanned(data)}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}>
      {children}
    </Camera>
  )
}

export default ScanCamera
