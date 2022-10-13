import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStore, resetStore } from "./store";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function saveSessionToFirestore() {
  const store = getStore();
  const session = {
    plan: store.plan,
    startDatetime: store.startDatetime,
    setTimeSeconds: store.setTimeSeconds,
    elapsedTimeSeconds: store.elapsedTimeSeconds,
    giveUpReason: store.giveUpReason,
    reflectionAnswers: store.reflectionAnswers,
  };
  console.log(session);
  resetStore();

  addDoc(collection(db, "[test]sessions"), session);
}
