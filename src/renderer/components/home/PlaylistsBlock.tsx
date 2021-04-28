import { makeStyles, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { LandingBlock, LandingBlockEntity, PersonalPlaylistEntityData } from '../../api/yandex';

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
  block: LandingBlock,
  showAllHandler?: (block: LandingBlock) => void
}

const COVER_SIZE = '400x400';

const getCoverUrl = (data: PersonalPlaylistEntityData['data']) => {
 let url;
 if (data.animatedCoverUri) {
  url = data.animatedCoverUri;
 } else {
  url = data.cover.uri;
 }
 return 'http://' + url.replace('%%', COVER_SIZE);
}

export const PlaylistsBlock = ({ block, showAllHandler } : PlaylistsBlockProps) => {
  const classes = useStyles();
  const carouselRef = useRef(null);
  const gesture = useGesture(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
    console.log(xDelta)
  });
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
      <div className={classes.carousel} ref={carouselRef}>
        {
          block.entities.map(entity => {
            const data = entity.data.data;
            return (
              <div className={classes.carouselItem} {...gesture()}>
                <div>
                  <img src={getCoverUrl(data)} width='100%' />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
