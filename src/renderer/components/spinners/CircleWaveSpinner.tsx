import { createStyles, makeStyles, withStyles } from '@material-ui/core';
import React from 'react';

const styles = createStyles((theme: any) => ({
  '@global': {
    '.double-bounce1, .double-bounce2': {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.8
    }
  }
}));

interface CircleWaveSpinnerProps {
  size?: number | string;
}

export const CircleWaveSpinner = withStyles(styles)(({size = 60}: CircleWaveSpinnerProps) => {
  return (
    <div className="spinner" style={{width: size, height: size}}>
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  )
});
