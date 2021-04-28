import { Backdrop, ButtonBase, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme, useMediaQuery, fade } from '@material-ui/core';
import React, { useState } from 'react';
import { LibraryMusicSharp as LibraryMusicSharpIcon, DehazeSharp as DehazeIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setCollapsed } from '../../redux/sidebar';
import history from '../../history';

const PAGES = [
  {
    icon: <LibraryMusicSharpIcon />,
    title: 'Main',
    link: '/main'
  },
];

export const SIDEBAR_WIDTH = 250;
export const COLLAPSED_SIDEBAR_WIDTH = 48;
export const HIDDEN_SIDEBAR_WIDTH = 0;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: SIDEBAR_WIDTH,
    paddingTop: 78,
    paddingBottom: 56,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 2,
    transition: 'width .2s ease-out',
    [theme.breakpoints.down('sm')]: {
      backdropFilter: 'blur(4px)',
      backgroundColor: fade(theme.palette.background.paper, 0.5)
    }
  },
  dehazeBtn: {
    position: 'absolute',
    top: 30,
    zIndex: 3,
    left: 0,
    padding: 12,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  list: {
    padding: 0,
    height: '100%',
    overflowX: 'hidden',
    'overflow-y': 'overlay'
  },
  listItem: {
    padding: '8px 12px'
  },
  backdrop: {
    zIndex: 1,
    color: '#fff',
  },
}));

export const Sidebar = () => {
  const classes = useStyles();
  const { collapsed } = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();

  const isXs = useMediaQuery<Theme>(theme=> theme.breakpoints.down('xs'));
  const isSm = useMediaQuery<Theme>(theme=> theme.breakpoints.down('sm'));

  return (
    <>
    <ButtonBase className={classes.dehazeBtn} onClick={() => dispatch(setCollapsed(!collapsed))}>
      <DehazeIcon />
    </ButtonBase>
    <Backdrop className={classes.backdrop} open={(isXs || isSm) && !collapsed} onClick={() => dispatch(setCollapsed(true))} />
    <div className={classes.root} style={{width: collapsed ? isXs ? HIDDEN_SIDEBAR_WIDTH : COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH }}>
      <List className={classes.list}>
      {
        PAGES.map(el => (
          <ListItem button className={classes.listItem} onClick={() => {history.push(el.link)}}>
            <ListItemIcon>
              {el.icon}
            </ListItemIcon>
            <ListItemText primary={el.title} />
          </ListItem>
        ))
      }
      </List>
    </div>
    </>
  )
};