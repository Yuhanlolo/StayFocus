export function secondsToHHMMSS(seconds) {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / (60 * 60));
  const m = Math.floor((seconds - h * 60 * 60) / 60);
  const s = seconds % 60;

  return [h, m, s];
}
