import {NativeModules} from 'react-native';

export async function isLocked() {
  let locked: boolean =
    await NativeModules.LockDetectionModule.getScreenStatus();
  return locked;
}
