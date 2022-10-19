import create from "zustand";

const defaultStates = {
  plan: "Doing stuff",
  startDatetime: "",
  setTimeSeconds: -1,
  elapsedTimeSeconds: -1,
  giveUpReason: "",
  reflectionAnswers: [],
};

export const durationMinutes = [
  0.1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
];

export const useLocalStore = create((set) => ({
  ...defaultStates,
  savePlan: (str) => set({ plan: str }),
  saveStartDatetime: () => set({ startDatetime: new Date().toJSON() }),
  saveSetTimeSeconds: (num) => set({ setTimeSeconds: num }),
  saveElapsedTimeSeconds: (num) => set({ elapsedTimeSeconds: num }),
  saveGiveUpReason: (str) => set({ giveUpReason: str }),
  saveReflectionAnswer: (str) =>
    set((state) => ({ reflectionAnswers: [...state.reflectionAnswers, str] })),
}));

export const getStore = () => useLocalStore.getState();

export const resetStore = () => useLocalStore.setState(defaultStates);
