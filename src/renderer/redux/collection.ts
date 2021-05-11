import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "../../common/logger";
import { getLikes, getTracks } from "../api/yandex";
import { AppDispatch, RootState } from "./store";

interface CollectionState {
  likes: string[], //ids

}

export const syncCollection = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const userId = getState().user.id!;
  if (localStorage.getItem('syncCollectionTime') == null) {
    const likes = (await getLikes(userId)).data;

    dispatch(setLikes(likes.result.library.tracks.map((el) => el.id)));

    const tracksToDownload = likes.result.library.tracks.map((el) => {
      return `${el.id}:${el.albumId}`;
    });

    const tracks = (await getTracks(tracksToDownload)).data;


  } else {

  }
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    likes: []
  } as CollectionState,
  reducers: {
    setLikes: (state, action: PayloadAction<string[]>) => {
      state.likes = action.payload;
    }
  },
  extraReducers: (builder) => {
 
  }
});

export const { setLikes } = collectionSlice.actions;

export default collectionSlice.reducer;