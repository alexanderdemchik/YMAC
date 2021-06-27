/**
 * Converts milliseconds to mm:ss or hh:mm:ss format
 * @param ms milliseconds
 * @returns {string}
 */
export function msToTime(ms?: number) {
  if (!ms) {
    return '00:00';
  }

  const seconds = ms / 1000;

  function pad(n: number) {
    const padding = 2;
    return ('00' + n).slice(-padding);
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds / 60) % 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  }
  return pad(mins) + ':' + pad(secs);
}
