import {getAppStore} from './store';
import {AnalyticsData} from './types';

function _AnalyticsData(date: string): AnalyticsData {
  const sessions = getAppStore().focusSessions;
  console.log(sessions);
  console.log(date);
  let completedCount = 0;
  let minutes = 0;
  let lastSessionEndTime = '';
  for (const s of sessions) {
    if (s.startTime.startsWith(date)) {
      const l = s.giveUpAttempts.length;
      if (l === 0 || !s.giveUpAttempts[l - 1].givenUp) {
        completedCount++;
      }
      minutes = minutes + s.completedMinutes;
      lastSessionEndTime = s.endTime;
    }
  }

  return {
    sessionsCount: completedCount,
    sessionsMinutes: minutes,
    lastSessionEndTime: lastSessionEndTime,
  };
}

function memoize(f: (date: string) => AnalyticsData) {
  const cache: {[key: string]: AnalyticsData} = {};
  return function (date: string) {
    if (date in cache) {
      return cache[date];
    }
    return (cache[date] = f(date));
  };
}

export const getAnalyticsData = memoize(_AnalyticsData);
