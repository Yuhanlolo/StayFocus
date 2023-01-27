import { NativeModules } from 'react-native';

async function lockDetection() {
  return new Promise((resolve, reject) => {
    NativeModules.LockDetectionModule.getScreenStatus().then((map) => {
      resolve(map['flag']);
    }, (code, message) => { })
  })

}

export default lockDetection;