import { AnyAction, Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { getUserInfo } from "./user"
import history from '../history';

export const initialize = () => async (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  if (!localStorage.getItem('token')) history.push('/login');

  const getUserInfoResult = await dispatch(getUserInfo());

  console.log(getUserInfoResult);
  if (getUserInfoResult.payload) {
    history.push('/main');
  } else {
    console.log('a')
    history.push('/login');
  }
}