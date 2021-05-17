import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cache } from "./cache";
import { AppDispatch } from "./store";

interface PlaylistState {
  playlist: Yandex.Playlist | null
}

export const setPlaylistByUidAndKind = (uid: number, kind: number) => async (dispatch: AppDispatch) => {
  dispatch(setPlaylist(cache.playlists[`${uid} ${kind}`]))
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlist: null
  } as PlaylistState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Yandex.Playlist | null>) => {
      state.playlist = action.payload;
    }
  }
});

export const { setPlaylist } = playlistSlice.actions;

export default playlistSlice.reducer;