export function msToTime(s?: number) {
  if (!s) {
    return '00:00';
  }

  s = s / 1000;
  
  function pad(n: number) {
    const padding = 2;
    return ('00' + n).slice(-padding);
  }

  let secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  if (hrs > 0) {
    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  }
  return pad(mins) + ':' + pad(secs);
}
