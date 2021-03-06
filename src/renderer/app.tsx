import React, {useEffect} from 'react';
import { YandexLogin } from './components/login/YandexLogin';
import { ThemeProvider, withStyles, CssBaseline, Theme } from '@material-ui/core';
import dark from './themes/dark';
import { Provider, useDispatch } from 'react-redux';
import store, { AppDispatch } from './redux/store';
import { Router, Route, Switch } from 'react-router-dom';
import './index.css';
import history from './history';
import { MainLayout } from './layouts/MainLayout';
import { getUserInfo } from './redux/user';
import { SplashScreen } from './components/splashscreen/SplashScreen';
import { checkAuth, initialInitialization, initializationAfterLogin } from './redux/app';
import { play } from './redux/player';
import { LoadScreen } from './components/loadscreen/LoadScreen';
import 'react-virtualized/styles.css';

const styles = (theme: Theme) => ({
  '@global': {
    html: {
      height: '100%',
      background: theme.palette.background.default
    },
    body: {
      height: '100%',
      overflow: 'hidden',
      margin: 0,
    },
    'button': {
      '&:disabled': {
        fill: theme.palette.action.disabled,
        '& svg': {
          fill: theme.palette.action.disabled,
        }
      }
    },
    '#root': {
      height: '100%',
      userSelect: 'none',
      '& img': {
        '-webkit-user-drag': 'none'
      }
    },
    '*::-webkit-scrollbar': {
      width: 11,
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      width: 5,
      minHeight: 80,
      backgroundClip: 'padding-box',
      border: '3px solid rgba(0,0,0,0)',
      borderTop: '10px solid rgba(0,0,0,0)',
      borderBottom: '10px solid rgba(0,0,0,0)',
      background: theme.palette.background.scroll,
    },
  }
});

const App = withStyles(styles)(() => {
  const dispatch = useDispatch<AppDispatch>();

  const initialization = async () => {
    await dispatch(initialInitialization());
    const authenticated = await dispatch(checkAuth());

    if (authenticated) {
      await dispatch(initializationAfterLogin());
      history.push('/main');
    } else {
      history.push('/login');
    }
  }

  useEffect(() => {
    initialization();
  }, []);

  return (
    <>
      <LoadScreen />
      <Switch>
        <Route path='/' component={SplashScreen} exact />
        <Route path='/login' component={YandexLogin} />
        <Route path='/main' component={MainLayout} />
      </Switch>
    </>
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