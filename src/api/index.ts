import { dateToHHMM } from "../helpers";
import {
  getSessionsFromFirestore,
  saveSessionToFirestore,
  saveUserSettingsToFirestore,
} from "./firestore";
import { getSession, getAppStore, resetSessionStore } from "./store";
import { UserSettings } from "./types";

export * from "./store";
export * from "./firestore";
export * from "./auth";
export * from "./notification";

export function saveSession() {
  const session = getSession();
  const appStore = getAppStore();
  const uid = appStore.uid!;

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

export async function getSessionsCountToday() {
  const uid = getAppStore().uid!;
  const sessions = await getSessionsFromFirestore(uid);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toJSON();

  let countToday = 0;
  sessions.forEach((doc) => {
    countToday += doc.id >= todayString ? 1 : 0;
    console.log(doc.id);
  });

  return countToday;
}

export async function getLastSessionEndTime() {
  const uid = getAppStore().uid!;
  const sessions = (await getSessionsFromFirestore(uid)).docs;

  if (sessions.length === 0) return "";
  const lastSession = sessions[sessions.length - 1].data();
  console.log(lastSession);

  const completedMinutes = lastSession.completedMinutes;
  const startTime = new Date(lastSession.timestamp);
  const endTime = new Date(startTime.getTime() + completedMinutes * 60000);

  return dateToHHMM(endTime);
}
