import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { LIKE_PLAYLIST_KIND } from '../../../common/database/playlist';
import { Image } from '../common/Image';

export const PLAYLIST_HEADER_HEIGHT = 282;

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 3,
    paddingTop: 30,
    height: PLAYLIST_HEADER_HEIGHT,
    minHeight: PLAYLIST_HEADER_HEIGHT,
    maxHeight: PLAYLIST_HEADER_HEIGHT,
    position: 'relative'
  },
  stickyRoot: {
    zIndex: 3,
    position: 'relative',
  },
  image: {
    height: 220,
    width: 220,
    boxShadow: theme.shadows[10]
  },
  title: {
    fontWeight: 700
  },
  smallImage: {
    height: 40,
    width: 40
  }
}));

interface PlaylistHeaderProps {
  coverUri: string,
  playlist: Yandex.Playlist,
}

const getTitle = (playlist: Yandex.Playlist) => {
  let title = '';

  if (playlist.kind === LIKE_PLAYLIST_KIND) {
    return 'Like';
  }

  if (playlist.title) {
    title = playlist.title;
  }
  return title;
}

export const PlaylistHeader = ({ coverUri, playlist }: PlaylistHeaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction='row' wrap='nowrap' spacing={4}>
        <Grid item>
          <Image src={coverUri} className={classes.image}/>
        </Grid>
        <Grid item container direction='column' style={{zIndex: 2}} spacing={1} justify='flex-end'>
          <Grid item>
            <Typography variant='caption'>PLAYLIST</Typography>
          </Grid>
          <Grid item>
            <Typography variant='h3' className={classes.title}>{getTitle(playlist)}</Typography>
          </Grid>
          <Grid item>
            <Button color='primary' variant='contained'>
              Shuffle
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
};

export const PlaylistStickyHeader = ({ coverUri, playlist }: PlaylistHeaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.stickyRoot}>
      <Grid container direction='row' wrap='nowrap' spacing={4}>
        <Grid item>
          <Image src={coverUri} className={classes.smallImage}/>
        </Grid>
      </Grid>
    </div>
  )
};