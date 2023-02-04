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
  sessionsMinutes: number;
  lastSessionEndTime: string;
}
