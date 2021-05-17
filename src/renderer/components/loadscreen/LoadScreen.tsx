import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}));

export const LoadScreen = () => {
  const classes = useStyles();
  const { initialData: { loading, progress } } = useSelector((state: RootState) => state.app);
  
  return (
    <>
      {
        loading && <div className={classes.root}>

        </div>
      }
    </>
  );
};
