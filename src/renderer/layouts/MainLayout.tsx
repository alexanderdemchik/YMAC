import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useLocation } from 'react-router';
import { Home } from '../components/home/Home';
import { Player } from '../components/player/Player';
import { Playlist } from '../components/playlist/Playlist';
import { Search } from '../components/search/Search';
import { Sidebar, HIDDEN_SIDEBAR_WIDTH, SIDEBAR_WIDTH, COLLAPSED_SIDEBAR_WIDTH } from '../components/sidebar/Sidebar';
import { Spacer } from '../components/sidebar/Spacer';
import Toolbar from '../components/toolbar/Toolbar';
import { RootState } from '../redux/store';

const useStyles = makeStyles((theme) => ({
  toolbarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  content: {
    display: 'flex'
  },
  spacer: {
    width: 250,
    transition: 'width .2s ease-out'
  }
}));

export const MainLayout = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.toolbarWrapper}>
        <Toolbar />
      </div>
      <Sidebar />
      <div className={classes.content}>
        <Spacer />
        <Switch>
          <Route path='/main' exact>
            <Home />
          </Route>
          <Route path='/main/users/:uid/playlists/:kind'>
            <Playlist />
          </Route>
        </Switch>
      </div>
      <Player />
    </div>
  )
}