interface GiveUpAttempt {
  timestamp: string;
  givenUp: boolean;
}

export interface Session {
  plan: string;
  startTime: string;
  endTime: string;
  focusDurationMinutes: number;
  completedMinutes: number;
  giveUpAttempts: GiveUpAttempt[];
  chatPrompts: JSON[];
}

export interface UserInfo {
  uid: string;
  username: string;
  dateCreated: Date;
}

export interface UserSettings {
  dailyMinMinutes: number;
  reminderTime: {
    hour: number;
    minute: number;
  };
}

export interface AnalyticsData {
  sessionsCount: number;
  completedSessionsCount: number;
  focusMinutes: number;
  lastSessionEndTime: string;
}

interface EventStats {
  screen_time_seconds: number;
  screen_unlock_count: number;
}

export type UsageStats = Record<string, EventStats>;
