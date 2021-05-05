import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { HIDDEN_SIDEBAR_WIDTH, SIDEBAR_WIDTH, COLLAPSED_SIDEBAR_WIDTH } from './Sidebar';
import { RootState } from '../../redux/store';

const useStyles = makeStyles((theme) => ({
  spacer: {
    width: SIDEBAR_WIDTH,
    transition: 'width .2s ease-out, min-width .2s ease-out',
  }
}));

interface SpacerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  inSearch?: boolean
}

export const Spacer = ({className, ...props}: SpacerProps) => {
  const classes = useStyles();
  const { collapsed } = useSelector((state: RootState) => state.sidebar);
  const isXs = useMediaQuery<Theme>(theme=> theme.breakpoints.down('xs'));
  const isSm = useMediaQuery<Theme>(theme=> theme.breakpoints.down('sm'));

  const spacerWidth = () => {
    if (collapsed) {
      if (isXs) {
        return HIDDEN_SIDEBAR_WIDTH;
      } else {
        return COLLAPSED_SIDEBAR_WIDTH;
      }
    } else {
      if (isXs) {
        return HIDDEN_SIDEBAR_WIDTH;
      } else if (isSm) {
        return COLLAPSED_SIDEBAR_WIDTH;
      }
      return SIDEBAR_WIDTH;
    }
  }

  const width = spacerWidth();

  return (
    <div className={`${classes.spacer} ${className ? className : ''}`} style={{width, minWidth: width}} {...props}/>
  );
}