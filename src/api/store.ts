import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";

import { clamp } from "../helpers";
import { Session, UserSettings } from "./types";

// AppStore: client-side persistent store for
// authentication info and global app settings
interface AppStore extends UserSettings {
  uid?: string;
  username?: string;
  dailyMinMinutes: number;
  reminderTime: {
    hour: number;
    minute: number;
  };
  minMinutes: number;
  maxMinutes: number;
  focusSessions: Session[];
  saveSettings: (settings: UserSettings) => void;
  saveSession: (session: Session) => void;
}

const defaultApp = {
  uid: null,
  username: null,
  dailyMinMinutes: 25,
  reminderTime: {
    hour: 8,
    minute: 0,
  },
  minMinutes: 0,
  maxMinutes: 120,
  focusSessions: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaultApp,
      saveSettings: (settings) => set(settings),
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
  newSession: (plan: string, minutes: number) => void;
  saveCompletedMinutes: (minutes: number) => void;
  saveGiveUpAttempt: (answers: string[], givenUp: boolean) => void;
  saveReflectionAnswers: (answers: string[]) => void;
  saveLastGiveUpAttempt: (answers: string[]) => void;
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
  newSession: (plan, minutes) =>
    set({
      plan: plan || defaultSession.plan,
      timestamp: new Date().toString(),
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
  saveLastGiveUpAttempt: (answers) =>
    set((state) => ({
      giveUpAttempts: state.giveUpAttempts.map((v, i) => {
        return i === state.giveUpAttempts.length - 1
          ? {
              ...v,
              answers: answers,
              givenUp: true,
            }
          : v;
      }),
    })),
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
