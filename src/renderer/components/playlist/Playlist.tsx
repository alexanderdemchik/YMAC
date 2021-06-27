import { makeStyles } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { LIKE_PLAYLIST_KIND } from "../../../common/database/playlist";
import playlist, {
  setPlaylist,
  setPlaylistByUidAndKind,
} from "../../redux/playlist";
import { RootState } from "../../redux/store";
import { PageContent } from "../common/PageContent";
import { Search } from "../search/Search";
import FavoriteCoverSrc from "../../assets/imloving.png";
import {
  PlaylistHeader,
  PlaylistStickyHeader,
  PLAYLIST_HEADER_HEIGHT,
} from "./PlaylistHeader";
import { CONTENT_LEFT_RIGHT_MARGIN } from "../../constants/styles";
import { PlaylistList } from "./PlaylistList";
import {
  pause,
  play,
  playTrack,
  setCurrent,
  setPlaying,
} from "../../redux/player";
import { likeTrack, removeTrackLike } from "../../redux/collection";

export const PLAYLIST_TOP_BACKGROUND_HEIGHT = 380;
export const PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
    overflow: "hidden",
  },
  playlistTopBackground: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 1,
    backgroundColor: theme.palette.background.default,
    top: 0,
    overflow: "hidden",
    width: "100%",
    height: PLAYLIST_TOP_BACKGROUND_HEIGHT,
    "& > img": {
      height: PLAYLIST_TOP_BACKGROUND_HEIGHT,
      width: "100%",
    },
    "& > div:first-child": {
      backgroundPositionY: "bottom",
      backgroundSize: `100% ${PLAYLIST_TOP_BACKGROUND_HEIGHT}px`,
      backgroundRepeat: "no-repeat",
      filter: "blur(30px)",
      height: "100%",
      "&:after": {
        content: "''",
        backgroundColor: "#000",
        opacity: "0.5",
        width: "100%",
        height: "100%",
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: 0,
      },
    },
  },
  stickyHeader: {
    position: "absolute",
    bottom: 10,
    pointerEvents: "none",
    left: CONTENT_LEFT_RIGHT_MARGIN,
    right: CONTENT_LEFT_RIGHT_MARGIN,
  },
}));

export const Playlist = () => {
  const { uid, kind } = useParams<{ uid: string; kind: string }>();

  const classes = useStyles();
  const dispatch = useDispatch();
  const playlist = useSelector((state: RootState) => state.playlist.playlist!);
  const likes = useSelector((state: RootState) => state.collection.likes!);
  const { current, playing } = useSelector((state: RootState) => state.player);
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
  };

  const onScroll = useCallback(
    (e) => {
      setScrolled(e.target.scrollTop);
    },
    [setScrolled]
  );

  const topBackgroundHeight = () => {
    const height = PLAYLIST_TOP_BACKGROUND_HEIGHT - scrolled;
    return height < PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT
      ? PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT
      : height;
  };
  const topHeight = topBackgroundHeight();

  const onPlaylistRowClick = useCallback(
    (track: Yandex.Track) => {
      if (track.id === current?.id) {
        if (playing) {
          pause();
        } else {
          play();
        }
      } else {
        dispatch(playTrack(track, playlist.tracks! as Yandex.Track[]));
      }
    },
    [dispatch, playlist, current, playing]
  );

  const onLikeClick = useCallback(
    (track: Yandex.Track, liked: boolean) => {
      if (!liked) {
        dispatch(likeTrack(track));
      } else {
        dispatch(removeTrackLike(track.id));
      }
    },
    [dispatch]
  );

  const liked = useCallback(
    (track: Yandex.Track) => {
      return likes.includes(track.id);
    },
    [likes]
  );

  if (!playlist) return <></>;

  return (
    <div className={classes.root}>
      <div
        className={classes.playlistTopBackground}
        style={{
          height: `${topHeight}px`,
          minHeight: `${topHeight}px`,
          maxHeight: `${topHeight}px`,
        }}
      >
        <div style={{ backgroundImage: `url(${getCoverUri()})` }} />
        {topHeight === PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT && (
          <div className={classes.stickyHeader}>
            <PlaylistStickyHeader
              coverUri={getCoverUri()}
              playlist={playlist}
            />
          </div>
        )}
      </div>
      <Search />
      <PageContent onScroll={onScroll}>
        {topHeight === PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT ? (
          <>
            <div
              style={{
                height: PLAYLIST_HEADER_HEIGHT,
                minHeight: PLAYLIST_HEADER_HEIGHT,
                zIndex: 3,
              }}
            />
            <div
              style={{
                height: PLAYLIST_HEADER_HEIGHT,
                zIndex: 3,
                position: "absolute",
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "relative",
              transform: `translateY(${-scrolled / 5}px)`,
              zIndex: 3,
            }}
          >
            <PlaylistHeader coverUri={getCoverUri()} playlist={playlist} />
          </div>
        )}
        <div>
          <PlaylistList
            data={playlist.tracks! as Yandex.Track[]}
            onRowClick={onPlaylistRowClick}
            current={current}
            playing={playing}
            liked={liked}
            onLikeClick={onLikeClick}
          />
        </div>
      </PageContent>
    </div>
  );
};
