import create from "zustand";

const defaultStates = {
  plan: "Doing stuff",
  startDatetime: "",
  setTimeSeconds: -1,
  elapsedTimeSeconds: -1,
  giveUpReason: "",
  reflectionAnswers: [],
};

export const useLocalStore = create((set) => ({
  ...defaultStates,
  savePlan: (str) => set((state) => ({ plan: str || state.plan })),
  saveStartDatetime: () => set({ startDatetime: new Date().toJSON() }),
  saveSetTimeSeconds: (num) => set({ setTimeSeconds: num }),
  saveElapsedTimeSeconds: (num) => set({ elapsedTimeSeconds: num }),
  saveGiveUpReason: (str) => set({ giveUpReason: str }),
  saveReflectionAnswer: (str) =>
    set((state) => ({ reflectionAnswers: [...state.reflectionAnswers, str] })),
}));

export const getStore = () => useLocalStore.getState();

export const resetStore = () => useLocalStore.setState(defaultStates);
