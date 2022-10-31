import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";

import { app } from "./firebase";
import { getAppStore, getSession, resetSessionStore } from "./store";
import { Session } from "./types";

const db = getFirestore(app);

export function saveSessionToFirestore() {
  const session: Session = getSession();
  console.log(session);
  resetSessionStore();

  const appStore = getAppStore();
  const uid = appStore.uid;
  addDoc(collection(db, "[test]db", uid, "log"), session);
}

export function saveUserToFireStore(uid: string, username: string) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, { username: username }, { merge: true });
}
