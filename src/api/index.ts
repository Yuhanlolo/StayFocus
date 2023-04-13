import {isDateBeforeToday, timestamp} from '../helpers';
import {
  saveSessionToFirestore,
  saveUsageStatsToFireStore,
  saveUserSettingsToFirestore,
} from './firestore';
import {
  getSession,
  getAppStore,
  resetSessionStore,
  useSessionStore,
} from './store';
import {UserSettings} from './types';

import {NativeModules} from 'react-native';

const {UsageStatsModule} = NativeModules;

export * from './store';
export * from './firestore';
export * from './auth';
export * from './notification';
export * from './isLocked';
export * from './analytics';

export function saveSession() {
  useSessionStore.setState({endTime: timestamp()});
  const appStore = getAppStore();
  const uid = appStore.uid!;

  const session = getSession();

  appStore.saveSession(session);
  saveSessionToFirestore(uid, session);
  console.log(session);

  resetSessionStore();
}

export function saveSettings(minutes: number, date: Date) {
  const appStore = getAppStore();
  const uid = appStore.uid!;
  const data: UserSettings = {
    dailyMinMinutes: minutes,
    reminderTime: {
      hour: date.getHours(),
      minute: date.getMinutes(),
    },
  };
  appStore.saveSettings(data);
  saveUserSettingsToFirestore(uid, data);
}

function _saveUsageStats(days: number) {
  const appStore = getAppStore();
  const uid = appStore.uid!;
  UsageStatsModule.getStats(days, (data: string) => {
    saveUsageStatsToFireStore(uid, JSON.parse(data));
    console.log(data);
  });
}

export function saveUsageStats() {
  const appStore = getAppStore();
  if (appStore.uid) {
    const lastUploadStatDate = appStore.lastUploadStatDate;
    const setUploadDate = appStore.setUploadDate;
    if (!lastUploadStatDate) {
      _saveUsageStats(7);
      setUploadDate();
    } else if (isDateBeforeToday(lastUploadStatDate)) {
      console.log(lastUploadStatDate);
      _saveUsageStats(1);
      setUploadDate();
    }
  }
}