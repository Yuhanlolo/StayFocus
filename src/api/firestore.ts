import { getFirestore, doc, setDoc } from "firebase/firestore";

import { app } from "./firebase";
import { Session } from "./types";

const db = getFirestore(app);

export function saveSessionToFirestore(uid: string, session: Session) {
  const sessionRef = doc(db, "[test]db", uid, "log", new Date().toJSON());
  setDoc(sessionRef, session);
}

export function saveUserToFireStore(uid: string, username: string) {
  const userRef = doc(db, "[test]db", uid);
  setDoc(userRef, { username: username }, { merge: true });
}
