import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStore, resetStore } from "./store";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.FIREBASE_APIKEY,
  authDomain: "stayfocus-cityu.firebaseapp.com",
  projectId: "stayfocus-cityu",
  storageBucket: "stayfocus-cityu.appspot.com",
  messagingSenderId: "253056798296",
  appId: "1:253056798296:web:607e8084588a70281b042d",
};

const app = initializeApp(firebaseConfig);
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
