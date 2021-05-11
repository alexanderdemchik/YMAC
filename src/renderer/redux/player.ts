import { createAsyncThunk, createSlice, Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';
import { getDirectLink, getPlaylist } from '../api/yandex';
import { AppDispatch, RootState } from './store';
import * as playerData from '../../common/database/player';
import { throttle } from 'lodash';
import logger from '../../common/logger';
import audio from '../utils/AudioController';

export interface PlayerState {
  playing: boolean,
  queue: Yandex.Track[],
  current: Yandex.Track | null,
  shuffle: boolean,
  played: number,
  buffered: number,
  duration: number,
  history: Yandex.Track[],
  volume: number,
  muted: boolean
}

const initialState: PlayerState = {
  playing: false,
  queue: [],
  history: [],
  current: null,
  shuffle: true,
  played: 0,
  buffered: 0,
  volume: audio.volume,
  duration: 0,
  muted: audio.muted
};

const saveStateToDb = (store: MiddlewareAPI) => {
  const userId = store.getState().user.id;
  logger.debug(`saveStateToDb for user ${userId}`);
  if (userId) {
    playerData.update(userId, store.getState().player);
  }
};

const saveStateToDbThrottled = throttle(saveStateToDb, 2000);

export const stateChangeListenerMiddleware: Middleware = store => next => action => {
  const res = next(action);

  if ([setQueue.type, setCurrent.type, setHistory.type, setBuffered.type, setVolume.type, setDuration.type, setPlaying.type, setShuffle.type, setPlayed.type].includes(action.type)) {
    saveStateToDbThrottled(store);
  }

  return res;
};

export const play = () => {
  audio.play();
}

export const pause = () => {
  audio.pause();
}

export const seekTo = (val: number) => (dispatch: AppDispatch) => {
  audio.currentTime = val * audio.duration;
  dispatch(setPlayed(val));
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
);

export const syncStateWithAudio = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { volume, played, playing, duration, muted, current } = getState().player;

  if (volume) audio.volume = volume;
  if (muted) audio.muted = muted;

  if (current) {
    const link = await getDirectLink(parseInt(current.id));
    audio.src = link;
  }

  if (played) {
    audio.oncanplay = () => { audio.currentTime = played * duration; audio.oncanplay = () => {} };
  }

  if (playing) {
    audio.play();
  }
}

export const init = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const userId = getState().user.id;

  if (!userId) {
    logger.error('Error to initialize player state, empty user id');
    return;
  }
  const data = await playerData.getByUserId(userId);
  if (data) {
    dispatch(setState(data));
    dispatch(syncStateWithAudio());
  } else {
    await playerData.create(userId, getState().player);
  }
}

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
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
      audio.muted = action.payload;
    },
    setState: (state, action: PayloadAction<PlayerState>) => {
      const playerState = action.payload;
      state.queue = playerState.queue;
      state.current = playerState.current;
      state.history = playerState.history;
      state.buffered = 0;
      state.duration = playerState.duration;
      state.muted = playerState.muted;
      state.shuffle = playerState.shuffle;
      state.volume = playerState.volume;
      state.played = playerState.played;
      state.playing = playerState.playing;
    }
  }
});

export const { setQueue, setCurrent, setPlaying, setPlayed, setDuration, setBuffered, setShuffle, setHistory, setVolume, setMuted, setState } = playerSlice.actions;


export default playerSlice.reducer;