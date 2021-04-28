import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    marginTop: 78,
    height: 'calc(100vh - 78px - 56px)',
    overflow: 'auto',
    marginBottom: 56
  }
}));

export const PageContent = ({ children }: { children: any }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  )
}