import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {clamp} from '../helpers';
import {Session, UserSettings} from './types';

// AppStore: client-side persistent store for
// authentication info and global app settings
interface AppStore extends UserSettings {
  uid: string | undefined;
  username: string | undefined;
  dateCreated: Date | undefined;
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
  uid: undefined,
  username: undefined,
  dateCreated: undefined,
  dailyMinMinutes: 25,
  reminderTime: {
    hour: 8,
    minute: 0,
  },
  minMinutes: 25,
  maxMinutes: 125,
  focusSessions: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      ...defaultApp,
      saveSettings: settings => set(settings),
      saveSession: session =>
        set(state => ({focusSessions: [...state.focusSessions, session]})),
    }),
    {
      name: 'app-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const getAppStore = () => useAppStore.getState();

interface UserInfo {
  uid: string;
  username: string;
  dateCreated: Date;
}
export const saveUserInfo = (info: UserInfo) => useAppStore.setState(info);

export const resetUserInfo = () => useAppStore.setState(defaultApp);

// SessionStore: client-side non-persistent store for
// session info, reset after each focus session
interface SessionStore extends Session {
  newSession: (plan: string, minutes: number) => void;
  saveCompletedMinutes: (minutes: number) => void;
  saveGiveUpAttempt: (givenUp: boolean) => void;
  saveLastGiveUpAttempt: () => void;
}

const defaultSession = {
  plan: 'Doing stuff',
  startTime: '',
  endTime: '',
  focusDurationMinutes: -1,
  completedMinutes: -1,
  giveUpAttempts: [],
};

export const useSessionStore = create<SessionStore>()(set => ({
  ...defaultSession,
  newSession: (plan, minutes) =>
    set({
      plan: plan || defaultSession.plan,
      startTime: Date().toString(),
      focusDurationMinutes: clamp(
        defaultApp.minMinutes,
        minutes,
        defaultApp.maxMinutes,
      ),
    }),
  saveCompletedMinutes: minutes => set({completedMinutes: minutes}),
  saveGiveUpAttempt: givenUp =>
    set(state => ({
      giveUpAttempts: [
        ...state.giveUpAttempts,
        {
          timestamp: Date().toString(),
          givenUp: givenUp,
        },
      ],
    })),
  saveLastGiveUpAttempt: () =>
    set(state => ({
      giveUpAttempts: state.giveUpAttempts.map((v, i) => {
        return i === state.giveUpAttempts.length - 1
          ? {
              ...v,
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
    startTime: store.startTime,
    endTime: store.endTime,
    focusDurationMinutes: store.focusDurationMinutes,
    completedMinutes: store.completedMinutes,
    giveUpAttempts: store.giveUpAttempts,
  };
}

export const resetSessionStore = () => useSessionStore.setState(defaultSession);
