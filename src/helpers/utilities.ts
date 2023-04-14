export function secondsToHHMMSS(seconds: number) {
  if (seconds < 0) {
    seconds = 0;
  }
  const h = Math.floor(seconds / (60 * 60));
  const m = Math.floor((seconds - h * 60 * 60) / 60);
  const s = seconds % 60;

  return [h, m, s];
}

export function dateToHHMM(date: Date) {
  const hh = date.getHours().toString(10).padStart(2, '0');
  const mm = date.getMinutes().toString(10).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function dateToYYYYMMDD(date: Date) {
  const YYYY = date.getFullYear().toString(10).padStart(4, '0');
  const MM = (date.getMonth() + 1).toString(10).padStart(2, '0');
  const DD = date.getDate().toString(10).padStart(2, '0');
  return `${YYYY}-${MM}-${DD}`;
}

export function clamp(min: number, val: number, max: number) {
  console.log(val);
  return Math.max(Math.min(val, max), min);
}

// Taken from https://stackoverflow.com/a/12646864
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Taken from https://stackoverflow.com/a/69462557
// Thanks Sweden!
export function timestamp() {
  return new Date().toLocaleString('sv-SE');
}

// https://stackoverflow.com/a/40890488
export function isDateBeforeToday(date: string) {
  return date < dateToYYYYMMDD(new Date());
}
