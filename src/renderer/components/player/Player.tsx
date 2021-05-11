import { Button, ButtonBase, Fade, Icon, makeStyles, Paper, Popper } from '@material-ui/core';
import { FavoriteSharp, MoreHoriz, NotInterestedSharp, PauseSharp, PlayArrowSharp, QueueMusicSharp, SkipNextSharp, SkipPreviousSharp, VolumeUpSharp } from '@material-ui/icons';
import { throttle } from 'lodash';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { convertUri } from '../../api/yandex';
import { pause, play, playNext, setMuted, setVolume } from '../../redux/player';
import { RootState } from '../../redux/store';
import { IconButton } from '../common/IconButton';
import { Image } from '../common/Image';
import { TrackPlaceholder } from '../placeholders/TrackPlaceholder';
import { SeekBar } from './SeekBar';
import { Volume } from './Volume';

export const PLAYER_HEIGHT = 56;

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: PLAYER_HEIGHT,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 5px'
  },
  leftItems: {
    display: 'flex',
    flexDirection: 'row',
    '& > button': {
      margin: 5
    }
  },
  rightItems: {
    display: 'flex',
    flexDirection: 'row',
    '& > button': {
      margin: 5
    }
  },
  seekBarWrapper: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0
  },
  albumImg: {
    margin: 3,
    minWidth: 50,
    minHeight: 50,
    maxWidth: 50
  },
  trackInfo: {
    display: 'grid',
    flexDirection: 'column',
    alignContent: 'center',
    padding: '6px 10px'
  },
  artist: {
    padding: 2,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: '0.83em',
  },
  track: {
    padding: 2,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }
}));

export const Player = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { playing, played, buffered, history, current, volume, muted } = useSelector((state: RootState) => state.player);

  const setVolumeThrottled = useCallback(throttle((val) => {dispatch(setVolume(val))}, 100), [dispatch]); // throttle volume change to avoid a lot of rerenders

  if (!current) {
    return <div></div>
  }

  return (
    <div className={classes.root}>
      <div className={classes.seekBarWrapper}>
        <SeekBar progress={played} buffered={buffered} />
      </div>
      <div className={classes.leftItems}>
        <IconButton disabled={!history.length}>
          <SkipPreviousSharp />
        </IconButton>
        {
          playing ? (
            <IconButton onClick={() => pause()}> 
              <PauseSharp />
            </IconButton>
          ) : (
            <IconButton onClick={() => play()}>
              <PlayArrowSharp />
            </IconButton>
          )
        }
        <IconButton onClick={() => { dispatch(playNext()); }}>
          <SkipNextSharp />
        </IconButton>
        <Image src={convertUri(current?.coverUri)} className={classes.albumImg} placeholder={<TrackPlaceholder />}/>
        <div className={classes.trackInfo}>
          <div className={classes.track}>
            {current?.title}{current?.version ? `(${current.version})` : ''}
          </div>
          <div className={classes.artist}>
            {current?.artists?.map((el) => el.name).join(',')}
          </div>
        </div>
        <IconButton>
          <FavoriteSharp style={{padding: 3}} />
        </IconButton>
        <IconButton>
          <NotInterestedSharp  style={{padding: 3}} />
        </IconButton>
        <IconButton>
          <MoreHoriz  style={{padding: 1}} />
        </IconButton>
      </div>
      <div className={classes.rightItems}>
        <IconButton>
          <QueueMusicSharp />
        </IconButton>
        <Volume volume={volume} setVolume={setVolumeThrottled} muted={muted} setMuted={(val) => dispatch(setMuted(val))} />
      </div>
    </div>
  )
}