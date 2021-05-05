import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  },
  img: {
    width: '100%',
    height: '100%'
  },
  placeholder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
}));

interface ImageProps {
  placeholder?: JSX.Element,
  className?: string,
  src?: string
}

export const Image = ({ className = '', placeholder, src } : ImageProps) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`${classes.root} ${className}`}>
      {(!loaded || error) && <div className={classes.placeholder}>{placeholder}</div>}
      <img className={classes.img} onLoad={() => setLoaded(true)} onError={(e) => {console.log(e); setError(true)}} src={src}/>
    </div>
  );
}