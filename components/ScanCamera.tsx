import {StyleProp, ViewStyle} from 'react-native';
import React from 'react';
// import {BarCodeScanner} from 'expo-barcode-scanner';
import {CameraView, FlashMode} from 'expo-camera';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onQrcodeScanned: (code?: string) => void;
  torch: boolean;
};

const ScanCamera = ({children, style, onQrcodeScanned, torch}: Props) => {
  return (
    <CameraView
      style={style}
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
      flash={torch ? 'on': 'off'}
      onBarcodeScanned={({data}) => onQrcodeScanned(data)}>
      {children}
    </CameraView>
  );
};

export default ScanCamera;
