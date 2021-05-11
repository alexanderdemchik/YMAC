import { playNext, setBuffered, setDuration, setPlayed, setPlaying } from '../redux/player';
import { Store } from '../redux/store';

const audio = new Audio();
let store: Store;

export const initialize = (storeArg: Store) => {
  store = storeArg;
  audio.addEventListener('play', () => {
    store.dispatch(setPlaying(true));
  });
  
  audio.addEventListener('pause', () => {
    store.dispatch(setPlaying(false));
  });
  
  audio.addEventListener('playing', () => {
    store.dispatch(setPlaying(true));
  });
  
  audio.addEventListener('ended', () => {
    store.dispatch(playNext());
  });
  
  audio.addEventListener('progress', () => {
    store.dispatch(setBuffered(audio.buffered.end(0) / audio.duration));
  });
  
  audio.addEventListener('timeupdate', () => {
    store.dispatch(setPlayed(audio.currentTime / audio.duration));
  });
  
  audio.addEventListener('durationchange', () => {
    store.dispatch(setDuration(audio.duration));
  });
}

export default audio;