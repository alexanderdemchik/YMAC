import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getTokenBySessionId } from '../api/yandex';
import { COOKIES_SESSION_ID_KEY, REDIRECT_URL as YANDEX_REDIRECT_URL } from '../constants/yandex';
import { Ipc } from '../utils/Ipc';
import history from '../history';
import { getUserInfo } from './user';
import { initializationAfterLogin } from './app';

const ipc = new Ipc();

export const handleLogin = createAsyncThunk(
  'handleLogin',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    const cookies: {name: string, value: string}[] = (await ipc.invoke('getCookies', YANDEX_REDIRECT_URL));

    const sid = cookies.find(el => el.name === COOKIES_SESSION_ID_KEY)?.value;

    if (sid) {
      const response = await getTokenBySessionId(sid);
      const data = response.data;
  
      localStorage.setItem('sid', sid);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('expiresIn', data.expires_in.toString());

      await dispatch(getUserInfo());

      await dispatch(initializationAfterLogin());

      history.push('/main');
    } else {
      rejectWithValue({});
    }

    return null;
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    error: false
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(handleLogin.fulfilled, (state, { payload }) => {
    });
    builder.addCase(handleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  }
});

export const { setLoading, setError } = loginSlice.actions;

export default loginSlice.reducer;