import { makeStyles } from '@material-ui/core';
import React, { useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { PlaylistsBlockEntity } from './PlaylistsBlockEntity';
import { useDispatch } from 'react-redux';
import { playPlaylist } from '../../redux/player';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'    
  },
  headerLeft: {

  },
  headerRight: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  title: {
    ...theme.typography.h5,
    fontWeight: 700,
  },
  carousel: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
      height: 0,
      width: 0,
      background: 'transparent'
    },
    '&::-webkit-scrollbar-track': {
      display: 'none',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      display: 'none',
      backgroundClip: 'padding-box',
      border: 'none',
      width: 0,
      borderTop: 'none',
      borderBottom: 'none',
      background: theme.palette.background.scroll,
    },
    margin: '-5px'
  },
  carouselItem: {
    minWidth: '25%',
    padding: '5px',
  }
}));
interface PlaylistsBlockProps {
  block: Yandex.LandingBlock,
  showAllHandler?: (block: Yandex.LandingBlock) => void
}

export const PlaylistsBlock = ({ block, showAllHandler } : PlaylistsBlockProps) => {
  const classes = useStyles();
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselGesture = useDrag(({down, delta: [deltaX], ...state}) => {
    if (down) {
      if (carouselRef.current != null) {
        carouselRef.current.scrollLeft = carouselRef.current.scrollLeft - deltaX;
      }
    }
  });
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <div className={classes.title}>{block.title}</div>
          <div>{block.description}</div>
        </div>
        <div className={classes.headerRight}>
          {showAllHandler && <span onClick={() => showAllHandler(block)}>Show all</span>}
        </div>
      </div>
      <div className={classes.carousel} ref={carouselRef} {...carouselGesture()}>
        {
          block.entities.map(entity => {
            const data = entity.data.data;
            return (
              <div className={classes.carouselItem}>
                <PlaylistsBlockEntity entity={entity} onPlayClick={() => { dispatch(playPlaylist({ uid: data.uid, kind: data.kind }))}}/>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
