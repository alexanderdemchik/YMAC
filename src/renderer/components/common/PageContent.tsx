import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    marginTop: 78,
    height: 'calc(100vh - 78px - 56px)',
    overflow: 'overlay!important',
    overflowX: 'hidden',
    marginBottom: 56,
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

interface PageContentProps {
  children: any,
  onScroll: any
}

export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(({ children, onScroll }, ref) => {
  const classes = useStyles();

  return (
    <div className={classes.root} onScroll={onScroll} ref={ref}>
      {children}
    </div>
  )
});