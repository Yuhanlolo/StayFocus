import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {clamp, dateToYYYYMMDD, timestamp} from '../helpers';
import {Session, UserInfo, UserSettings} from './types';

// AppStore: client-side persistent store for
// authentication info and global app settings
interface AppStore extends UserSettings {
  uid: string | undefined;
  username: string | undefined;
  dateCreated: Date | undefined;
  lastUploadStatDate: string | undefined;
  dailyMinMinutes: number;
  reminderTime: {
    hour: number;
    minute: number;
  };
  minMinutes: number;
  maxMinutes: number;
  focusSessions: Session[];
  setUploadDate: () => void;
  saveSettings: (settings: UserSettings) => void;
  saveSession: (session: Session) => void;
}

const defaultApp = {
  uid: undefined,
  username: undefined,
  dateCreated: undefined,
  lastUploadStatDate: undefined,
  dailyMinMinutes: 25,
  reminderTime: {
    hour: 8,
    minute: 0,
  },
  minMinutes: 0,
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
      setUploadDate: () =>
        set({lastUploadStatDate: dateToYYYYMMDD(new Date())}),
    }),
    {
      name: 'app-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const getAppStore = () => useAppStore.getState();

export const saveUserInfo = (info: UserInfo) => useAppStore.setState(info);

export const saveSessions = (sessions: Session[]) =>
  useAppStore.setState({focusSessions: sessions});

export const resetUserInfo = () => useAppStore.setState(defaultApp);

// SessionStore: client-side non-persistent store for
// session info, reset after each focus session
interface SessionStore extends Session {
  newSession: (plan: string, minutes: number) => void;
  saveCompletedMinutes: (minutes: number) => void;
  saveGiveUpAttempt: (answers: string[], givenUp: boolean) => void;
  saveReflectionAnswers: (answers: string[]) => void;
  saveLastGiveUpAttempt: () => void;
}

const defaultSession = {
  plan: 'Doing stuff',
  startTime: '',
  endTime: '',
  focusDurationMinutes: -1,
  completedMinutes: -1,
  giveUpAttempts: [],
  reflectionAnswers: [],
};

export const useSessionStore = create<SessionStore>()(set => ({
  ...defaultSession,
  newSession: (plan, minutes) =>
    set({
      plan: plan || defaultSession.plan,
      startTime: timestamp(),
      focusDurationMinutes: clamp(
        defaultApp.minMinutes,
        minutes,
        defaultApp.maxMinutes,
      ),
    }),
  saveCompletedMinutes: minutes => set({completedMinutes: minutes}),
  saveGiveUpAttempt: (answers, givenUp) =>
    set(state => ({
      giveUpAttempts: [
        ...state.giveUpAttempts,
        {
          timestamp: timestamp(),
          answers: answers,
          givenUp: givenUp,
        },
      ],
    })),
  saveReflectionAnswers: answers => set({reflectionAnswers: answers}),
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
    reflectionAnswers: store.reflectionAnswers,
  };
}

export const resetSessionStore = () => useSessionStore.setState(defaultSession);
