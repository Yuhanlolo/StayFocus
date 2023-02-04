import {getAppStore} from './store';
import {AnalyticsData} from './types';

function _AnalyticsData(date: string): AnalyticsData {
  const sessions = getAppStore().focusSessions;
  console.log(sessions);
  console.log(date);
  let count = 0;
  let minutes = 0;
  let lastSessionEndTime = '';
  for (const s of sessions) {
    console.log(s);
    if (s.startTime.startsWith(date)) {
      count++;
      minutes = minutes + s.completedMinutes;
      lastSessionEndTime = s.endTime;
    }
  }

  return {
    sessionsCount: count,
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
