export function secondsToHHMMSS(seconds: number) {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / (60 * 60));
  const m = Math.floor((seconds - h * 60 * 60) / 60);
  const s = seconds % 60;

  return [h, m, s];
}

export function dateToHHMM(date: Date) {
  const hh = date.getHours().toString(10).padStart(2, "0");
  const mm = date.getMinutes().toString(10).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function clamp(min: number, val: number, max: number) {
  console.log(val);
  return Math.max(Math.min(val, max), min);
}
