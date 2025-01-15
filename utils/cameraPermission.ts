import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request, requestMultiple } from 'react-native-permissions';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

export const checkCameraPermission = async () => {
  try {
    if (!CAMERA_PERMISSION) {
      throw new Error('Platform not supported');
    }

    const result = await check(CAMERA_PERMISSION);
    
    switch (result) {
      case RESULTS.GRANTED:
        return { granted: true, message: 'Permission already granted' };
      case RESULTS.DENIED:
        return { granted: false, message: 'Permission denied but requestable' };
      case RESULTS.BLOCKED:
        return { granted: false, message: 'Permission blocked in settings' };
      case RESULTS.UNAVAILABLE:
        return { granted: false, message: 'Camera feature is not available' };
      default:
        return { granted: false, message: 'Permission check failed' };
    }
  } catch (error) {
    return { 
      granted: false, 
      message: `Error checking permission: ${error.message}` 
    };
  }
};

export const requestCameraPermission = async () => {
  try {
    if (!CAMERA_PERMISSION) {
      throw new Error('Platform not supported');
    }

    const result = await request(CAMERA_PERMISSION);
    
    switch (result) {
      case RESULTS.GRANTED:
        return { granted: true, message: 'Permission granted' };
      case RESULTS.DENIED:
        return { granted: false, message: 'Permission denied by user' };
      case RESULTS.BLOCKED:
        return { granted: false, message: 'Permission blocked in settings' };
      default:
        return { granted: false, message: 'Permission request failed' };
    }
  } catch (error) {
    return { 
      granted: false, 
      message: `Error requesting permission: ${error.message}` 
    };
  }
};

export const handleCameraPermission = async () => {
  const checkResult = await checkCameraPermission();
  
  if (checkResult.granted) {
    return checkResult;
  }

  const requestResult = await requestCameraPermission();
  return requestResult;
};

export const initialCameraRequest = async () => {
    const result = await handleCameraPermission();
    if (!result.granted) true
    
  };
export const askCameraPermission = async () => {
    console.log("This should request sdsdsds camera")
    if (Platform.OS === 'android') {
      await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ])
    } else {
      await requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE])
    }
  }