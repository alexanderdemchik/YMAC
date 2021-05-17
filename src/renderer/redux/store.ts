import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import user from './user';
import toolbar from './toolbar';
import login from './login';
import sidebar from './sidebar';
import home from './home';
import app from './app';
import collection from './collection';
import playlist from './playlist';
import player, { stateChangeListenerMiddleware } from './player';
import { initialize as initializeAudio } from '../utils/AudioController';

const store = configureStore({
  reducer: combineReducers({
    user,
    toolbar,
    login,
    sidebar,
    home,
    player,
    app,
    collection,
    playlist
  }),
  devTools: process.env.NODE_ENV === 'development',
  middleware: [stateChangeListenerMiddleware, ...getDefaultMiddleware()] as const
});

initializeAudio(store);

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
