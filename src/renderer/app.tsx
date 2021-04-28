import React, {useEffect} from 'react';
import { YandexLogin } from './components/login/YandexLogin';
import { ThemeProvider, withStyles, CssBaseline, Theme } from '@material-ui/core';
import dark from './themes/dark';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import { Router, Route, Switch } from 'react-router-dom';
import './index.css';
import history from './history';
import { MainLayout } from './layouts/MainLayout';
import { getUserInfo } from './redux/user';
import { SplashScreen } from './components/splashscreen/SplashScreen';
import { initialize } from './redux/app';

const styles = (theme: Theme) => ({
  '@global': {
    html: {
      height: '100%',
      background: theme.palette.background.default
    },
    body: {
      height: '100%',
      margin: 0,
    },
    '#root': {
      height: '100%',
    },
    '*::-webkit-scrollbar': {
      width: 11,
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      width: 5,
      backgroundClip: 'padding-box',
      border: '3px solid rgba(0,0,0,0)',
      borderTop: '10px solid rgba(0,0,0,0)',
      borderBottom: '10px solid rgba(0,0,0,0)',
      background: theme.palette.background.scroll,
    },
  }
});

const App = withStyles(styles)(() => {
  const dispatch = useDispatch();

  const initialization = () => {
    dispatch(initialize());
  }

  useEffect(() => {
    initialization();
  }, []);
  return (
    <Switch>
      <Route path='/' component={SplashScreen} exact/>
      <Route path='/login' component={YandexLogin} />
      <Route path='/main' component={MainLayout} />
    </Switch>
  );
});

export default () => (
  <Provider store={store}>
    <ThemeProvider theme={dark}>
      <CssBaseline />
        <Router history={history}>
          <App />
        </Router>
    </ThemeProvider>
  </Provider>
);