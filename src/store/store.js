import create from "zustand";
import { clamp } from "../helpers";

const defaultStates = {
  plan: "Doing stuff",
  startDatetime: "",
  setTimeSeconds: -1,
  elapsedTimeSeconds: -1,
  minTimeSeconds: 10 * 60,
  maxTimeSeconds: 120 * 60,
  giveUpReason: "",
  reflectionAnswers: [],
};

export const useLocalStore = create((set) => ({
  ...defaultStates,
  savePlan: (str) => set((state) => ({ plan: str || state.plan })),
  saveStartDatetime: () => set({ startDatetime: new Date().toJSON() }),
  saveSetTimeSeconds: (num) =>
    set((state) => ({
      setTimeSeconds: clamp(state.minTimeSeconds, num, state.maxTimeSeconds),
    })),
  saveElapsedTimeSeconds: (num) => set({ elapsedTimeSeconds: num }),
  saveGiveUpReason: (str) => set({ giveUpReason: str }),
  saveReflectionAnswer: (str) =>
    set((state) => ({ reflectionAnswers: [...state.reflectionAnswers, str] })),
}));

export const getStore = () => useLocalStore.getState();

export const resetStore = () => useLocalStore.setState(defaultStates);
