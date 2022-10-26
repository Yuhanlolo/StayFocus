import create from "zustand";
import { clamp } from "../helpers";

const defaultStates = {
  plan: "Doing stuff",
  startDatetime: "",
  setSeconds: -1,
  elapsedSeconds: -1,
  minSeconds: 10 * 60,
  maxSeconds: 120 * 60,
  giveUpAttempts: [],
  reflectionAnswers: [],
};

export const useLocalStore = create((set) => ({
  ...defaultStates,
  savePlan: (str) => set((state) => ({ plan: str || state.plan })),
  saveStartDatetime: () => set({ startDatetime: new Date().toString() }),
  saveSetSeconds: (num) =>
    set((state) => ({
      setSeconds: clamp(state.minSeconds, num, state.maxSeconds),
    })),
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

export const getStore = () => useLocalStore.getState();

export const resetStore = () => useLocalStore.setState(defaultStates);
