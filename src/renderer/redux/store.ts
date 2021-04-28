import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import user from './user';
import toolbar from './toolbar';
import login from './login';
import sidebar from './sidebar';
import home from './home';

const store = configureStore({
  reducer: combineReducers({
    user,
    toolbar,
    login,
    sidebar,
    home
  }),
  devTools: process.env.NODE_ENV === 'development'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
