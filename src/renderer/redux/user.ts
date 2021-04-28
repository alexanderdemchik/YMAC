import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as YandexAPI from '../api/yandex';
export const getUserInfo = createAsyncThunk(
  'getUserInfo',
  async (_, { dispatch, rejectWithValue }) => {
    const response = await YandexAPI.getUserInfo();
    const data = response.data;
    return data;
  }
)

interface UserState {
  authenticated: boolean,
  id?: number,
  login?: string,
  displayName?: string,
  defaultEmail?: string,
  avatarId?: string,
  isAvatarEmpty?: boolean
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    authenticated: false,
    id: undefined,
    login: undefined,
    displayName: undefined,
    defaultEmail: undefined,
    avatarId: undefined,
    isAvatarEmpty: undefined
  } as UserState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      const authenticated = action.payload;
      state.authenticated = authenticated; 
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.id = payload.id;
      state.login = payload.login;
      state.displayName = payload.display_name;
      state.defaultEmail = payload.default_email;
      state.avatarId = payload.default_avatar_id;
      state.isAvatarEmpty = payload.is_avatar_empty;
    });
  }
});

export const { setAuthenticated } = userSlice.actions;

export default userSlice.reducer;