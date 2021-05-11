import { Fade, fade, makeStyles, Paper, Popper } from '@material-ui/core';
import { useSpring } from 'react-spring';
import React, { useRef, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { seekTo } from '../../redux/player';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 5,
    width: '100%',
    backgroundColor: fade(theme.palette.background.scroll, 0.7),
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    left: 0
  },
  buffered: {
    position: 'absolute',
    height: '100%',
    left: 0,
    backgroundColor: fade(theme.palette.background.scroll, 0.5),
  },
  interactArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '200%'
  }
}));

interface SeekBarProps {
  progress: number,
  buffered: number,
}

export const SeekBar = ({ progress = 0, buffered = 0 } : SeekBarProps) => {
  const [seek, setSeek] = useState<number | null>(null);
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  const gesture = useDrag(({down, xy: [x], ...state}) => {
    if (down && ref.current) {
      const value = x / ref.current.clientWidth;
      setSeek(value < 0 ? 0 : value > 1 ? 1 : value);
    } else {
      dispatch(seekTo(seek as number));
      setSeek(null);
    }
  });

  const progressWidth = () => {
    if (seek != null) {
      return seek * 100;
    } else {
      return progress * 100;
    }
  }

  return (
    <div className={classes.root} ref={ref}>
      <div className={classes.buffered} style={{ width: `${buffered * 100}%` }} /> 
      <div className={classes.progress} style={{ width: `${progressWidth()}%` }} />
      <div className={classes.interactArea} {...gesture()} />
    </div>
  );
};