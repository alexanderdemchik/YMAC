import { makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { LIKE_PLAYLIST_KIND } from '../../../common/database/playlist';
import playlist, { setPlaylist, setPlaylistByUidAndKind } from '../../redux/playlist';
import { RootState } from '../../redux/store';
import { PageContent } from '../common/PageContent';
import { Search } from '../search/Search';
import FavoriteCoverSrc from '../../assets/imloving.png'
import { PlaylistHeader, PlaylistStickyHeader, PLAYLIST_HEADER_HEIGHT } from './PlaylistHeader';
import { CONTENT_LEFT_RIGHT_MARGIN } from '../../constants/styles';
import { Header as DataHeader, Table, ColumnDescription } from './PlaylistTable';
import { ScheduleOutlined } from '@material-ui/icons';
import { msToTime } from '../../utils/msToTime';

export const PLAYLIST_TOP_BACKGROUND_HEIGHT = 380;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  playlistTopBackground: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 1,
    backgroundColor: theme.palette.background.default,
    top: 0,
    overflow: 'hidden',
    width: '100%',
    height: PLAYLIST_TOP_BACKGROUND_HEIGHT,
    '& > img': {
      height: PLAYLIST_TOP_BACKGROUND_HEIGHT,
      width: '100%',
    },
    '& > div:first-child': {
      backgroundPositionY: 'bottom',
      backgroundSize: `100% ${PLAYLIST_TOP_BACKGROUND_HEIGHT}px`,
      backgroundRepeat: 'no-repeat',
      filter: 'blur(30px)',
      height: '100%',
      '&:after': {
        content: "\'\'",
        backgroundColor: '#000',
        opacity: '0.5',
        width: '100%',
        height: '100%',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
      }
    }
  },
  stickyHeader: {
    position: 'absolute',
    bottom: 10,
    pointerEvents: 'none',
    left: CONTENT_LEFT_RIGHT_MARGIN,
    right: CONTENT_LEFT_RIGHT_MARGIN
  }
}));

export const Playlist = () => {
  const { uid, kind } = useParams<{uid: string, kind: string}>();

  const classes = useStyles();
  const dispatch = useDispatch();
  const playlist = useSelector((state: RootState) => state.playlist.playlist!);
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    dispatch(setPlaylistByUidAndKind(parseInt(uid), parseInt(kind)));
  }, [uid, kind]);

  const getCoverUri = (): string => {
    if (playlist.kind === LIKE_PLAYLIST_KIND) {
      return FavoriteCoverSrc;
    } else {
      return playlist.ogImage!;
    }
  }

  const columns: ColumnDescription<Yandex.Track>[] = useMemo(() => [
    {
      title: 'TRACK',
      size: 5,
      fieldRenderer: (row: Yandex.Track) => row.title 
    },
    {
      title: 'ARTIST',
      size: 3,
      fieldRenderer: (row: Yandex.Track) => row.artists!.map((el) => el.name).join(',')
    },
    {
      title: 'ALBUM',
      size: 3,
      fieldRenderer:  (row: Yandex.Track) => {
        return row.albums!.map((el) => el.title).join(',');
      }
    },
    {
      title: <div><ScheduleOutlined fontSize='small'/></div>,
      size: 1,
      fieldRenderer: (row: Yandex.Track) => msToTime(row.durationMs)
    }
  ], []);

  const onScroll = useCallback(e => {
    setScrolled(e.target.scrollTop);
  }, [setScrolled]);

  const topBackgroundHeight = () => {
    const height = PLAYLIST_TOP_BACKGROUND_HEIGHT - scrolled;
    return height < 150 ? 150 : height;
  };
  const topHeight = topBackgroundHeight();

  if (!playlist) return <></>;

  return (
    <div className={classes.root}>
      <div className={classes.playlistTopBackground} style={{height: `${topHeight}px`, minHeight: `${topHeight}px`, maxHeight: `${topHeight}px`}}>
        <div style={{backgroundImage: `url(${getCoverUri()})`}} />
        {
          topHeight === 150 && (
            <div className={classes.stickyHeader}>
              <PlaylistStickyHeader coverUri={getCoverUri()} playlist={playlist} />
            </div>
          )
        }
      </div>
      <Search />
      <PageContent onScroll={onScroll}>
        {
          topHeight === 150 ? <><div style={{height: PLAYLIST_HEADER_HEIGHT, minHeight: PLAYLIST_HEADER_HEIGHT,  zIndex: 3}} /><div style={{height: PLAYLIST_HEADER_HEIGHT, zIndex: 3, position: 'absolute'}} /></> : <div style={{position: 'relative', transform: `translateY(${-scrolled / 5}px)`, zIndex: 3}}>
            <PlaylistHeader coverUri={getCoverUri()} playlist={playlist} />
          </div>
        }
        <div>
          <Table columns={columns} data={playlist.tracks as Yandex.Track[]} />
        </div>
      </PageContent>
    </div>
  )
}