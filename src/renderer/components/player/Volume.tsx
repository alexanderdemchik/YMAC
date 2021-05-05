import { ClickAwayListener, Fade, fade, makeStyles, Paper, Popper } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HighQualityOutlined, TuneSharp, VolumeUpSharp } from '@material-ui/icons';
import { IconButton } from '../common/IconButton';
import { useDrag } from 'react-use-gesture';
import { throttle } from 'lodash';

const useStyles = makeStyles((theme) => ({
  popper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  volumeSlider: {
    paddingLeft: 4,
    paddingRight: 12,
    display: 'flex',
    alignItems: 'center',
  },
  volumeSliderFilled: {
    background: theme.palette.primary.main,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0
  },
  volumeSliderEmpty: {
    height: 4,
    background: theme.palette.background.scroll,
    width: 100,
    position: 'relative'
  }
}));

interface VolumeProps {
  volume: number,
  setVolume: (val: number) => void
}

export const Volume = ({ volume, setVolume } : VolumeProps) => {
  const classes = useStyles();
  const ref = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [localVal, setLocalVal] = useState<number | null>(null); // use local value of volume slider on change to avoid friezes

  const gesture = useDrag(({down, xy: [x]}) => {
    if (down && sliderRef.current) {
      let value = (x - sliderRef.current.getBoundingClientRect().left) / sliderRef.current.clientWidth;
      value = value < 0 ? 0 : value > 1 ? 1 : value;
        
      setLocalVal(value);
      setVolume(value);
    } else {
      setLocalVal(null);
    }
  });

  useEffect(() => {
    const onResize = () => setOpen(false);

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <>
      <IconButton ref={ref} onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}>
        <VolumeUpSharp />
      </IconButton>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Popper open={open} anchorEl={ref.current} placement={'top-end'} transition keepMounted modifiers={{
          offset: {
            enabled: true,
            offset: '0, 15',
          },
          preventOverflow: {
            enabled: true
          },
          hide: {
            enabled: true
          }
        }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper className={classes.popper}>
                <IconButton>
                  <TuneSharp />
                </IconButton>
                <IconButton>
                  <HighQualityOutlined />
                </IconButton>
                <IconButton>
                  <VolumeUpSharp />
                </IconButton>
                <div className={classes.volumeSlider}>
                  <div className={classes.volumeSliderEmpty} ref={sliderRef} {...gesture()}>
                    <div className={classes.volumeSliderFilled} style={{width: `${(localVal !== null ? localVal : volume) * 100}%`}}/>
                  </div>
                </div>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </>
  );
};