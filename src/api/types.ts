export interface GiveUpAttempt {
  timestamp: string;
  givenUp: boolean;
  answers: string[];
}

export interface Session {
  timestamp: string;
  focusDurationMinutes: number;
  completedMinutes: number;
  giveUpAttempts: GiveUpAttempt[];
  reflectionAnswers: string[];
}
