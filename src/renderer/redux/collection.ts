import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "../../common/logger";
import { getLikes, getTracks } from "../api/yandex";
import { setInitialDataLoading } from "./app";
import { AppDispatch, RootState } from "./store";
import * as playlistDb from '../../common/database/playlist';
import * as tracksDb from '../../common/database/tracks';

interface CollectionState {
  likesPlaylist: Yandex.Playlist | null,
  likes: string[], //ids
}

export const initialCollectionSync = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const userId = getState().user.id!;

  dispatch(setInitialDataLoading(true));

  const likes = (await getLikes(userId)).data;

  const likesPlaylist = await playlistDb.createIfNeed({
    uid: userId,
    kind: playlistDb.LIKE_PLAYLIST_KIND,
    revision: likes.result.library.revision
  });

  const likesIds = likes.result.library.tracks.map((el) => el.id);

  const tracksToDownload = likes.result.library.tracks.map((el) => {
    return `${el.id}:${el.albumId}`;
  });

  const tracks = (await getTracks(tracksToDownload)).data.result;

  await tracksDb.create(tracks);
  await playlistDb.assignTracksToPlaylist(likesIds, likesPlaylist.uid, likesPlaylist.kind);

  dispatch(setInitialDataLoading(false));
}

export const initialize = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const uid = getState().user.id!;
  
  const playlist = await playlistDb.getByUidAndKindWithTracks(uid, playlistDb.LIKE_PLAYLIST_KIND);

  if (playlist) {
    dispatch(setLikesPlaylist(playlist));
    const tracks = <Yandex.Track[]>playlist.tracks!;
    dispatch(setLikes(tracks.map(el => el.id)));
  }
}



const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    likesPlaylist: null,
    likes: []
  } as CollectionState,
  reducers: {
    setLikes: (state, action: PayloadAction<string[]>) => {
      state.likes = action.payload;
    },
    setLikesPlaylist: (state, action: PayloadAction<Yandex.Playlist | null>) => {
      state.likesPlaylist = action.payload;
    },
  },
  extraReducers: (builder) => {
 
  }
});

export const { setLikes, setLikesPlaylist } = collectionSlice.actions;

export default collectionSlice.reducer;