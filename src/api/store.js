import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { persist } from "zustand/middleware";
import { clamp } from "../helpers";

const defaultApp = {
  uid: null,
  username: null,
  minSeconds: 10 * 60,
  maxSeconds: 120 * 60,
  focusSessions: [],
};

export const useAppStore = create(
  persist(
    (set) => ({
      ...defaultApp,
      login: (uid) => set({ uid: uid }),
      saveSession: (session) =>
        set({ focusSessions: [...focusSessions, session] }),
    }),
    {
      name: "app-data",
      getStorage: () => AsyncStorage,
    }
  )
);

export const getAppStore = () => useAppStore.getState();

export const saveUserInfo = (uid, username) =>
  useAppStore.setState({ uid: uid, username: username });

export const resetUserInfo = () => useAppStore.setState(defaultApp);

const defaultStates = {
  plan: "Doing stuff",
  startDatetime: "",
  setSeconds: -1,
  elapsedSeconds: -1,
  giveUpAttempts: [],
  reflectionAnswers: [],
};

export const useSessionStore = create((set) => ({
  ...defaultStates,
  savePlan: (str) => set((state) => ({ plan: str || state.plan })),
  saveStartDatetime: () => set({ startDatetime: new Date().toString() }),
  saveSetSeconds: (num) =>
    set({
      setSeconds: clamp(defaultApp.minSeconds, num, defaultApp.maxSeconds),
    }),
  saveElapsedSeconds: (num) => set({ elapsedSeconds: num }),
  saveGiveUpAttempts: (str, givenUp) =>
    set((state) => ({
      giveUpAttempts: [
        ...state.giveUpAttempts,
        { timestamp: new Date().toString(), reason: str, givenUp: givenUp },
      ],
    })),
  saveReflectionAnswer: (str) =>
    set((state) => ({ reflectionAnswers: [...state.reflectionAnswers, str] })),
}));

export const getSessionStore = () => useSessionStore.getState();

export const resetSessionStore = () => useSessionStore.setState(defaultStates);

export const saveSessionToAppStore = () =>
  useAppStore.getState().saveSession(getSessionStore());
