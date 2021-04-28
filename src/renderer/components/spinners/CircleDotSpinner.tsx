import { createStyles, makeStyles, withStyles } from '@material-ui/core';
import React from 'react';

const styles = createStyles((theme: any) => ({
  '@global': {
    '.sk-chase-dot:before': {
      backgroundColor: theme.palette.primary.main
    }
  }
}));

interface CircleDotSpinnerProps {
  size?: number;
}

export const CircleDotSpinner = withStyles(styles)(({size = 60}: CircleDotSpinnerProps) => {
  return (
    <div className="sk-chase" style={{width: size, height: size}}>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  )
});
