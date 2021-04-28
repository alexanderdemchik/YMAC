import { Button, ButtonBase, Icon, makeStyles } from '@material-ui/core';
import { PlayArrowSharp, SkipNextSharp, SkipPreviousSharp } from '@material-ui/icons';
import React from 'react';
import { IconButton } from '../common/IconButton';
import { SeekBar } from './SeekBar';

export const PLAYER_HEIGHT = 56;

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: PLAYER_HEIGHT,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 5px'
  },
  leftItems: {
    display: 'flex',
    flexDirection: 'row',
    '& > button': {
      margin: 5
    }
  },
  rightItems: {

  },
  seekBarWrapper: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0
  }
}));

export const Player = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.seekBarWrapper}>
        <SeekBar />
      </div>
      <div className={classes.leftItems}>
        <IconButton>
          <SkipPreviousSharp />
        </IconButton>
        <IconButton>
          <PlayArrowSharp />
        </IconButton>
        <IconButton>
          <SkipNextSharp />
        </IconButton>
      </div>
      <div className={classes.rightItems}>

      </div>
    </div>
  )
}