import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  initializeFirestore,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

import {app} from './firebase';
import {Session, UserSettings} from './types';

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
      time: Date().toString(),
    }),
  });
}

export function getSessionsFromFirestore(uid: string) {
  const sessionsRef = collection(db, dbName, uid, 'log');
  const todaySessions = query(sessionsRef);
  return getDocs(todaySessions);
}

export async function getChatPrompts(uid: string) {
  const querySnapshot = await getDocs(collection(db, dbName, uid, 'log'));
  let histories = new Array();
  querySnapshot.forEach((doc) => {
    histories = [...histories, ...doc.data().chatPrompts];
})
  return histories;
}