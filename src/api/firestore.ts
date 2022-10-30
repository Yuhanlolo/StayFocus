import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";

import { app } from "./firebase";
import { getAppStore, getSessionStore, resetSessionStore } from "./store";
import { Session } from "./types";

const db = getFirestore(app);

export function saveSessionToFirestore() {
  const store = getSessionStore();
  const session: Session = {
    timestamp: store.startDatetime,
    focusDurationMinutes: Math.floor(store.setSeconds / 60),
    completedMinutes: Math.floor(store.elapsedSeconds / 60),
    giveUpAttempts: store.giveUpAttempts,
    reflectionAnswers: store.reflectionAnswers,
  };
  console.log(session);
  resetSessionStore();

  const appStore = getAppStore();
  const uid = appStore.uid;
  addDoc(collection(db, "[test]db", uid, "log"), session);
}

export function saveUserToFireStore(uid, username) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, { username: username }, { merge: true });
}
