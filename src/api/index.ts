import {
  saveSessionToFirestore,
  saveUserSettingsToFirestore,
} from "./firestore";
import { getSession, getAppStore, resetSessionStore } from "./store";
import { UserSettings } from "./types";

export * from "./store";
export * from "./firestore";
export * from "./auth";

export function saveSession() {
  const session = getSession();
  const appStore = getAppStore();
  const uid = appStore.uid;

  appStore.saveSession(session);
  saveSessionToFirestore(uid, session);
  console.log(session);

  resetSessionStore();
}

export function saveSettings(minutes: number, date: Date) {
  const appStore = getAppStore();
  const uid = appStore.uid;
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
