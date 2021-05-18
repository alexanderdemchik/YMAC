/**
 * Converts milliseconds to mm:ss or hh:mm:ss format
 * @param ms milliseconds
 * @returns 
 */
export function msToTime(ms?: number) {
  if (!ms) {
    return '00:00';
  }

  ms = ms / 1000;
  
  function pad(n: number) {
    const padding = 2;
    return ('00' + n).slice(-padding);
  }

  let secs = ms % 60;
  ms = (ms - secs) / 60;
  const mins = ms % 60;
  const hrs = (ms - mins) / 60;

  if (hrs > 0) {
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  }
  return pad(mins) + ':' + pad(secs);
}
