import { ButtonBase, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Favorite, FavoriteBorderSharp, FavoriteOutlined, FavoriteSharp, MoreHorizSharp, PlayArrowSharp } from '@material-ui/icons';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex'
  },
  hovered: {
  },
  playBtn: {
    width: '30%',
    height: 'auto',
    borderRadius: '50%',
    padding: '4%',
    margin: 8,
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    '& svg': {
      width: '100%',
      height: 'auto'
    }
  },
  optBtn: {
    width: '20%',
    height: 'auto',
    padding: '4%',
    borderRadius: '50%',
    background: theme.palette.background.paper,
    '& svg': {
      width: '100%',
      height: 'auto'
    }
  },
}));

const COVER_SIZE = '400x400';

const getCoverUrl = (data: Yandex.PersonalPlaylistEntityData['data']) => {
 let url;
 if (data.animatedCoverUri) {
  url = data.animatedCoverUri;
 } else {
  url = data.cover.uri;
 }
 return 'http://' + url.replace('%%', COVER_SIZE);
}

interface PlaylistsBlockEntityProps {
  entity: Yandex.LandingBlockEntity,
  onClick?: any,
  onPlayClick?: any
}

export const PlaylistsBlockEntity = ({ entity, onPlayClick } : PlaylistsBlockEntityProps) => {
  const classes = useStyles();
  const [hovered, setHovered] = useState(false);
  const data = entity.data.data;

  return (
    <div className={`${classes.root} ${hovered ? classes.hovered : ''}`} onMouseEnter={() => {setHovered(true)}} onMouseLeave={() => setHovered(false)}>
      <div style={{ width: "100%", position: 'relative', display: 'flex', flexGrow: 1 }}>
        {
          hovered && 
            <div className={classes.imageOverlay}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                <ButtonBase className={classes.optBtn}><FavoriteBorderSharp /></ButtonBase>
                <ButtonBase className={classes.playBtn} onClick={onPlayClick}><PlayArrowSharp/></ButtonBase>
                <ButtonBase className={classes.optBtn}><MoreHorizSharp/></ButtonBase>
              </div>
            </div>
        }
        <img src={getCoverUrl(data)} width='100%' />
      </div>
      <div>
        {data.title}<br/>
        <span dangerouslySetInnerHTML={{ __html: data.descriptionFormatted! }}/>
        </div>
    </div>
  );
};
