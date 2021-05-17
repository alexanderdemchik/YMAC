import { getUserInfo } from "./user"
import * as db from '../../common/database';
import * as player from "./player";
import { AppDispatch } from "./store";
import { ActionCreator, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import * as collection from "./collection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialInitialization = () => async (dispatch: AppDispatch) => {
  await db.init();
}

export const initializationAfterLogin = () => async (dispatch: AppDispatch) => {
  await dispatch(player.init());
  await dispatch(collection.initialCollectionSync());

  await dispatch(collection.initialize());
}

export const checkAuth: ActionCreator<ThunkAction<Promise<boolean>, any, null, AnyAction>> = () => async (dispatch: AppDispatch) => {
  if (!localStorage.getItem('token')) {
    return false;
  } else {
    const getUserInfoResult = await dispatch(getUserInfo());
  
    if (getUserInfoResult.payload) {
      return true;
    } else {
      return false;
    }
  }
}

const appSlice = createSlice({
  name: 'app',
  initialState: {
    initialData: {
      loading: false,
      progress: 0
    }
  },
  reducers: {
    setInitialDataLoading: (state, action: PayloadAction<boolean>) => {
      state.initialData.loading = action.payload;
    },
    setInitialDataProgress: (state, action: PayloadAction<number>) => {
      state.initialData.progress = action.payload;
    }
  }
});

export const { setInitialDataLoading, setInitialDataProgress } = appSlice.actions;

export default appSlice.reducer;