import { getUserInfo } from "./user"
import * as db from '../../common/database';
import * as player from "./player";
import { AppDispatch, RootState } from "./store";
import { ActionCreator, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { getLikes, getPlaylistList, getPlaylists, getTracks } from "../api/yandex";
import logger from "../../common/logger";
import { setLikes, syncCollection } from "./collection";

export const initialInitialization = () => async (dispatch: AppDispatch) => {
  await db.init();
}

export const initializationAfterLogin = () => async (dispatch: AppDispatch) => {
  await dispatch(player.init());
  await dispatch(syncCollection());
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