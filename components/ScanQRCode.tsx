import {ModalProps, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Box, Center, Pressable, Text} from 'native-base';
// import {requestPermissionsAsync as requestCameraPermissionsAsync} from 'expo-barcode-scanner';
import {PermissionStatus} from 'expo-modules-core';
import ScanCamera from './ScanCamera';
import ScanQRHeader from './ScanQRHeader';
import {useTranslation} from 'react-i18next';
import ScanImg from '~assets/svg/scan-img.svg';
import TorchOff from '~assets/svg/torch-off.svg';
import TorchOn from '~assets/svg/torch-on.svg';
import {TQRDATA} from '~screens/home/ClockInOutBtns';
import {isUndefined} from 'lodash';

interface Props extends ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setQrCodeData: (data: TQRDATA) => void;
  clockIn: boolean;
}

const ScanQRCode = ({visible, setVisible, clockIn, setQrCodeData}: Props) => {
  const [currentPermission, setCurrentPermission] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );
  const [torchOn, setTorchOn] = useState(false);
  const {t} = useTranslation('home');
  // useEffect(() => {
  //   requestCameraPermissionsAsync().then(({status}) =>
  //     setCurrentPermission(status),
  //   );
  // }, []);

  const handleScanQRCode = async (rawData: string | undefined) => {
    try {
      if (isUndefined(rawData)) {
        requestAnimationFrame(() => setVisible(false));
        return;
      }
      const scanData = JSON.parse(rawData);
      if (scanData.company_id) {
        const scanResults = {
          checkpoint: scanData?.checkpoint,
          company_id: scanData?.company_id,
          project_id: scanData?.project_id,
          supervisor_id: 0,
        };
        setQrCodeData(scanResults);
        requestAnimationFrame(() => setVisible(false));
      } else {
        await setQrCodeData({
          checkpoint: null,
          company_id: null,
          project_id: null,
          supervisor_id: null,
        });

        requestAnimationFrame(() => setVisible(false));
      }
    } catch (error) {
      await setQrCodeData({
        checkpoint: null,
        company_id: null,
        project_id: null,
        supervisor_id: null,
      });

      requestAnimationFrame(() => setVisible(false));
    }
  };

  const toggleTorch = () => setTorchOn(!torchOn);

  return (
    <Modal animationType="fade" visible={visible}>
      <ScanCamera
        style={{flex: 1}}
        onQrcodeScanned={handleScanQRCode}
        torch={torchOn}>
        <Box flex={1} px="16px" pt="40px">
          <ScanQRHeader
            onPress={() => setVisible(false)}
            title={clockIn ? t('scanInTitle') : t('scanOutTitle')}
          />
          <Center
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            overflow="hidden">
            <Box
              borderWidth={400}
              borderColor="rgba(0,0,0,.5)"
              borderRadius="425px"
              mb="50px">
              <ScanImg />
            </Box>
            <Pressable
              position="absolute"
              bottom="90px"
              onPress={toggleTorch}
              alignItems="center">
              {torchOn ? <TorchOn /> : <TorchOff />}
              <Text color="white" mt="16px" fontSize="16px">
                {t('toggleTorch')}
              </Text>
            </Pressable>
          </Center>
        </Box>
      </ScanCamera>
    </Modal>
  );
};

export default ScanQRCode;
