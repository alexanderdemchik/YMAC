import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDirectLink, getPlaylist } from '../api/yandex';
import { RootState } from './store';
import store from './store';

const audio = new Audio();

interface PlayerState {
  playing: boolean,
  queue: Yandex.Track[],
  current?: Yandex.Track,
  shuffle: boolean,
  played: number,
  buffered: number,
  duration: number,
  history: Yandex.Track[],
  volume: number
}

const initialState: PlayerState = {
  playing: false,
  queue: [],
  history: [],
  current: undefined,
  shuffle: true,
  played: 0,
  buffered: 0,
  volume: audio.volume,
  duration: 0,
};

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
  store.dispatch(setDuration(audio.currentTime));
});

export const play = () => {
  audio.play();
}

export const pause = () => {
  audio.pause();
}

export const seekTo = (val: number) => {
  audio.currentTime = val * audio.duration;
  store.dispatch(setPlayed(val));
}

export const playPlaylist = createAsyncThunk<void, { uid: number, kind: number }, { state: RootState }>(
  'player/playPlaylist',
  async ({uid, kind}, { dispatch }) => {

    const playlist = (await getPlaylist(uid, kind)).data.result;
    
    dispatch(setQueue(playlist.tracks.map(wrapper => wrapper.track)));
    dispatch(playNext());
  }
);

export const playNext = createAsyncThunk<void, void, { state: RootState }>(
  'player/playNext',
  async (_, { getState, dispatch }) => {
    try {
      const { shuffle, queue, current, history } = getState().player;

      if (current) {
        dispatch(setHistory([...history, current]));
      }

      const nextTrack = queue[shuffle ? Math.floor(Math.random() * queue.length) : queue.findIndex(el => el.id === current?.id) + 1];
      
      dispatch(setCurrent(nextTrack));
  
      const link = await getDirectLink(parseInt(nextTrack.id));
  
      audio.src = link;
      audio.play();
    } catch (e) {
      console.log(e);
    }
  }
)

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setQueue: (state, action: PayloadAction<Yandex.Track[]>) => {
      state.queue = action.payload;
    },
    setCurrent: (state, action: PayloadAction<Yandex.Track>) => {
      state.current = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setPlayed: (state, action: PayloadAction<number>) => {
      state.played = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setBuffered: (state, action: PayloadAction<number>) => {
      state.buffered = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },
    setHistory: (state, action: PayloadAction<Yandex.Track[]>) => {
      state.history = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      audio.volume = action.payload;
    },
  }
});

export const { setQueue, setCurrent, setPlaying, setPlayed, setDuration, setBuffered, setShuffle, setHistory, setVolume } = playerSlice.actions;


export default playerSlice.reducer;