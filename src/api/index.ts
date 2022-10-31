import { saveSessionToFirestore } from "./firestore";
import { getSession, getAppStore, resetSessionStore } from "./store";

export * from "./store";
export * from "./firestore";
export * from "./auth";

export function saveSession() {
  const session = getSession();
  const appStore = getAppStore();
  const uid = appStore.uid;

  appStore.saveSession(session);
  saveSessionToFirestore(uid, session);
  console.log(session);

  resetSessionStore();
}
