interface GiveUpAttempt {
  timestamp: string;
  givenUp: boolean;
  answers: string[];
}

export interface Session {
  plan: string;
  startTime: string;
  endTime: string;
  focusDurationMinutes: number;
  completedMinutes: number;
  giveUpAttempts: GiveUpAttempt[];
  reflectionAnswers: string[];
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
