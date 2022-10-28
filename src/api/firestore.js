import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export function saveSessionToFirestore() {
  const store = getStore();
  const session = {
    timestamp: store.startDatetime,
    focusDurationMinutes: Math.floor(store.setSeconds / 60),
    completedMinutes: Math.floor(store.elapsedSeconds / 60),
    giveUpAttempts: store.giveUpAttempts,
    reflectionAnswers: store.reflectionAnswers,
  };
  console.log(session);
  resetStore();

  addDoc(collection(db, "[test]sessions"), session);
}

export function saveUserToFireStore(uid, username) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, { username: username }, { merge: true });
}
