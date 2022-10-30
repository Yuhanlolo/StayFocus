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
    plan: store.plan,
    timestamp: store.timestamp,
    focusDurationMinutes: store.focusDurationMinutes,
    completedMinutes: store.completedMinutes,
    giveUpAttempts: store.giveUpAttempts,
    reflectionAnswers: store.reflectionAnswers,
  };
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
