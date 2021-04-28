import React from 'react';
import { ButtonBase, ButtonBaseProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 12,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

interface IconButtonProps extends ButtonBaseProps {}

export const IconButton = ({children, className = '', ...props}: IconButtonProps) => {
  const classes = useStyles();

  return <ButtonBase className={`${classes.root} ${className}`}>
    {children}
  </ButtonBase>
}