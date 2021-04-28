import { fade, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 5,
    width: '100%',
    backgroundColor: fade(theme.palette.background.scroll, 0.7)
  }
}));

export const SeekBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>

    </div>
  );
};