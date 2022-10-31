import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";

import { clamp } from "../helpers";
import { Session } from "./types";

// AppStore: client-side persistent store for
// authentication info and global app settings
interface AppStore {
  uid?: string;
  username?: string;
  minMinutes: number;
  maxMinutes: number;
  focusSessions: Session[];
  login: (uid: string) => void;
  saveSession: (session: Session) => void;
}

const defaultApp = {
  uid: null,
  username: null,
  minMinutes: 0,
  maxMinutes: 120,
  focusSessions: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaultApp,
      login: (uid) => set({ uid: uid }),
      saveSession: (session) =>
        set((state) => ({ focusSessions: [...state.focusSessions, session] })),
    }),
    {
      name: "app-data",
      getStorage: () => AsyncStorage,
    }
  )
);

export const getAppStore = () => useAppStore.getState();

export const saveUserInfo = (uid: string, username: string) =>
  useAppStore.setState({ uid: uid, username: username });

export const resetUserInfo = () => useAppStore.setState(defaultApp);

// SessionStore: client-side non-persistent store for
// session info, reset after each focus session
interface SessionStore extends Session {
  savePlan: (plan: string) => void;
  saveTimestamp: () => void;
  saveFocusDurationMinutes: (minutes: number) => void;
  saveCompletedMinutes: (minutes: number) => void;
  saveGiveUpAttempt: (answers: string[], givenUp: boolean) => void;
  saveReflectionAnswers: (answers: string[]) => void;
}

const defaultSession = {
  plan: "Doing stuff",
  timestamp: "",
  focusDurationMinutes: -1,
  completedMinutes: -1,
  giveUpAttempts: [],
  reflectionAnswers: [],
};

export const useSessionStore = create<SessionStore>()((set) => ({
  ...defaultSession,
  savePlan: (plan) => set((state) => ({ plan: plan || state.plan })),
  saveTimestamp: () => set({ timestamp: new Date().toString() }),
  saveFocusDurationMinutes: (minutes) =>
    set({
      focusDurationMinutes: clamp(
        defaultApp.minMinutes,
        minutes,
        defaultApp.maxMinutes
      ),
    }),
  saveCompletedMinutes: (minutes) => set({ completedMinutes: minutes }),
  saveGiveUpAttempt: (answers, givenUp) =>
    set((state) => ({
      giveUpAttempts: [
        ...state.giveUpAttempts,
        {
          timestamp: new Date().toString(),
          answers: answers,
          givenUp: givenUp,
        },
      ],
    })),
  saveReflectionAnswers: (answers) => set({ reflectionAnswers: answers }),
}));

export function getSession(): Session {
  const store = useSessionStore.getState();
  return {
    plan: store.plan,
    timestamp: store.timestamp,
    focusDurationMinutes: store.focusDurationMinutes,
    completedMinutes: store.completedMinutes,
    giveUpAttempts: store.giveUpAttempts,
    reflectionAnswers: store.reflectionAnswers,
  };
}

export const resetSessionStore = () => useSessionStore.setState(defaultSession);
