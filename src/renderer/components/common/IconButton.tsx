import React from 'react';
import { ButtonBase, ButtonBaseProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 12,
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    }
  },
  circle: {
    borderRadius: '50%'
  }
}));

export interface IconButtonProps extends Omit<ButtonBaseProps, 'component'> {
  circle?: boolean,
  component?: string
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({children, className = '', circle = false, component = 'button', ...props}, ref) => {
  const classes = useStyles();

  return (
    //@ts-ignore https://github.com/mui-org/material-ui/issues/15827
    <ButtonBase className={`${classes.root} ${className} ${circle ? classes.circle : ''}`} {...props} ref={ref} component={component}>
      {children}
    </ButtonBase>
  );
});
