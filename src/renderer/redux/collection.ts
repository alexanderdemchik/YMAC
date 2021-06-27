import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "../../common/logger";
import * as API from "../api/yandex";
import { setInitialDataLoading } from "./app";
import { AppDispatch, RootState } from "./store";
import * as playlistDb from '../../common/database/playlist';
import * as collectionDb from '../../common/database/collection';

interface CollectionState {
  likesPlaylist: Yandex.Playlist | null,
  likes: string[], //ids
}

export const initialCollectionSync = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const userId = getState().user.id!;

  dispatch(setInitialDataLoading(true));

  const likes = (await API.getLikes(userId)).data;

  const likesPlaylist = await playlistDb.createIfNeed({
    uid: userId,
    kind: playlistDb.LIKE_PLAYLIST_KIND,
    revision: likes.result.library.revision
  });

  const tracksToDownload = likes.result.library.tracks.map((el) => {
    return `${el.id}:${el.albumId}`;
  });

  const tracks = (await API.getTracks(tracksToDownload)).data.result;


  await collectionDb.addTracksLikes(likesPlaylist.uid, tracks);

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

export const likeTrack = (track: Yandex.Track) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const uid = getState().user.id!;
  const likes = getState().collection.likes;

  try {
    await API.likeTrack(uid, [`${track.id}:${extractAlbumId(track.albums)}`]);

    dispatch(setLikes([...likes, track.id]));

    await collectionDb.addTracksLikes(uid, [track])
  } catch (e) {
    logger.error('%o', e);
  }
}

export const removeTrackLike = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const uid = getState().user.id!;
  const likes = getState().collection.likes;

  try {
    await API.removeTracksLikes(uid, [id]);

    dispatch(setLikes(likes.filter(el => el !== id)));
    await collectionDb.removeTracksLikes(uid, [id]);
  } catch (e) {
    logger.error('%o', e);
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

const extractAlbumId = (albums?: Yandex.Album[]) => {
  if (!albums || !albums[0]) return null;
  return albums[0].id;
}

export const { setLikes, setLikesPlaylist } = collectionSlice.actions;

export default collectionSlice.reducer;