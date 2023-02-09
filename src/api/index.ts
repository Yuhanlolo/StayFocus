import {saveSessionToFirestore, saveUserSettingsToFirestore} from './firestore';
import {
  getSession,
  getAppStore,
  resetSessionStore,
  useSessionStore,
} from './store';
import {UserSettings} from './types';

export * from './store';
export * from './firestore';
export * from './auth';
export * from './notification';
export * from './isLocked';
export * from './analytics';

export function saveSession() {
  useSessionStore.setState({endTime: new Date().toJSON()});
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
