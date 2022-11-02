import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { app } from "./firebase";
import { Session, UserSettings } from "./types";

const db = getFirestore(app);

export function saveSessionToFirestore(uid: string, session: Session) {
  const sessionRef = doc(db, "[test]db", uid, "log", new Date().toJSON());
  setDoc(sessionRef, session);
}

export function saveUserToFirestore(uid: string, username: string) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, { username: username }, { merge: true });
}

export function saveUserSettingsToFirestore(
  uid: string,
  settings: UserSettings
) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, settings, { merge: true });
}

export function getSessionsFromFirestore(uid: string) {
  const sessionsRef = collection(db, "[test]db", uid, "log");
  const todaySessions = query(sessionsRef);
  return getDocs(todaySessions);
}
