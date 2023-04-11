import {
  doc,
  setDoc,
  collection,
  getDocs,
  initializeFirestore,
  updateDoc,
  arrayUnion,
  getDoc,
  writeBatch,
} from 'firebase/firestore';

import {app} from './firebase';
import {Session, UsageStats, UserInfo, UserSettings} from './types';
import {timestamp} from '../helpers';

/*
  Fix weird Firestore connection timeout that only occurs on the
  development build but not on Expo Go. See more in the following:
  - https://github.com/firebase/firebase-js-sdk/issues/6718
  - https://stackoverflow.com/a/71413916
  - https://github.com/expo/expo/issues/17119
  Despite what the Expo dev said in the last issue (firebase SDK>=9.2.0
  fixed it), the bug still occurs, and we still need this patch here.
*/
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

const dbName = 'test-chatbot';

export function saveSessionToFirestore(uid: string, session: Session) {
  const sessionRef = doc(db, dbName, uid, 'log', session.startTime);
  setDoc(sessionRef, session);
}

export function saveUserToFirestore(uid: string, username: string) {
  const userRef = doc(db, dbName, uid);
  setDoc(
    userRef,
    {
      username: username,
      settings: {},
      settings_changes: [],
      date_created: new Date().toJSON(),
    },
    {merge: true},
  );
}

export function saveUserSettingsToFirestore(
  uid: string,
  settings: UserSettings,
) {
  const userRef = doc(db, dbName, uid);
  updateDoc(userRef, {
    settings: settings,
    settings_changes: arrayUnion({
      newSettings: settings,
      time: timestamp(),
    }),
  });
}

export function saveUsageStatsToFireStore(uid: string, stats: UsageStats) {
  const batch = writeBatch(db);
  for (const key in stats) {
    const docRef = doc(db, dbName, uid, 'stats', key);
    batch.set(docRef, stats[key]);
  }
  batch.commit();
}

export async function getUserInfoFromFirestore(uid: string): Promise<UserInfo> {
  const userRef = doc(db, dbName, uid);
  const docData = (await getDoc(userRef)).data()!;
  return {
    uid: uid,
    username: docData.username,
    dateCreated: docData.date_created,
  };
}

export async function getSessionsFromFirestore(
  uid: string,
): Promise<Session[]> {
  const sessionsRef = collection(db, dbName, uid, 'log');
  const sessionsSnap = await getDocs(sessionsRef);
  let sessions: Session[] = [];
  sessionsSnap.forEach(document => {
    sessions.push(document.data() as Session);
  });
  return sessions;
}

export async function getDateCreatedFromFirestore(uid: string) {
  const userRef = doc(db, dbName, uid);
  const docSnap = await getDoc(userRef);
  return docSnap.data()!.date_created;
}

export async function getChatPrompts(uid: string) {
  const querySnapshot = await getDocs(collection(db, dbName, uid, 'log'));
  let histories = new Array();
  querySnapshot.forEach((doc) => {
    histories = [...histories, ...doc.data().chatPrompts];
})
  return histories;
}