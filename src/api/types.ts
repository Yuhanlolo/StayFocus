interface GiveUpAttempt {
  timestamp: string;
  givenUp: boolean;
  answers: string[];
}

export interface Session {
  plan: string;
  timestamp: string;
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
