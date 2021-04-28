import { makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_URL as YANDEX_OAUTH_URL, REDIRECT_URL as YANDEX_REDIRECT_URL } from '../../constants/yandex';
import { handleLogin } from '../../redux/login';
import { RootState } from '../../redux/store';
import { Ipc } from '../../utils/Ipc';
import { CircleDotSpinner } from '../spinners/CircleDotSpinner';
import Toolbar from '../toolbar/Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  },
  webview: {
    flexGrow: 1
  },
  loadScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export const YandexLogin = () => {
  const classes = useStyles();
  const ipc = useRef(new Ipc());
  const webviewRef = useRef<Electron.WebviewTag>(null);
  const { loading, error } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  const handleDidNavigate = useCallback(async (event: Electron.DidNavigateEvent) => {
    if (event.url.startsWith(YANDEX_REDIRECT_URL)) {
      dispatch(handleLogin());
    }
  }, [webviewRef]);

  useEffect(() => {
    const node = webviewRef.current;

    if (node) {
      node.addEventListener('did-navigate', handleDidNavigate);
    }
  }, [webviewRef]);

  return (
    <div className={classes.root}>
      <Toolbar />
      <div style={{display: 'flex', flexGrow: 1, position: 'relative'}}>
        {!loading && <webview ref={webviewRef} className={classes.webview} src={YANDEX_OAUTH_URL} />}
        {loading && <div className={classes.loadScreen}><CircleDotSpinner /></div>}
      </div>
    </div>
  );
}