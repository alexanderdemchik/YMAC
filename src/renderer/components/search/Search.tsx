import { ButtonBase, makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { SearchSharp } from '@material-ui/icons';
import React from 'react';
import { Spacer } from '../sidebar/Spacer';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    zIndex: 2,
    left: 0,
    right: 0,
    top: 30
  },
  search: {
    flexGrow: 1,
    height: 48,
    maxHeight: 48,
    margin: '0px 20px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    color: theme.palette.text.primary
  },
  searchXs: {
    flexGrow: 1,
    height: 48,
    maxHeight: 48,
    margin: '0px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    boxSizing: 'border-box',
    color: theme.palette.text.primary
  },
  searchXsBtn: {
    padding: 12,
    '&:hover': {
      background: theme.palette.action.hover
    }
  },
  input: {
    outline: 'none',
    border: 'none',
    background: 'transparent',
    padding: 5,
    color: theme.palette.text.primary
  }
}));

export const Search = () => {
  const classes = useStyles();
  const isXs = useMediaQuery<Theme>(theme => theme.breakpoints.down('xs'));

  return (
    <div className={classes.root}>
      {
        isXs ? (
          <div className={classes.searchXs}>
            <ButtonBase className={classes.searchXsBtn}>
              <SearchSharp />
            </ButtonBase>
          </div>
        ) : (
          <div className={classes.search}>  
            <SearchSharp />
            <input className={classes.input} placeholder='Search' />
          </div>
        )
      }
    </div>
  );
}