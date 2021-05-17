import React, { useEffect } from 'react';
import { Link, NavLinkProps } from 'react-router-dom';
import { cache } from '../../redux/cache';

interface PlaylistLinkProps extends NavLinkProps {
  playlist: Yandex.Playlist
}

export const PlaylistLink = ({playlist, ...props}: PlaylistLinkProps) => {

  useEffect(() => {
    if (playlist) {
      cache.playlists[`${playlist.uid} ${playlist.kind}`] = playlist;
    }
  }, [playlist]);

  return (
    <Link {...props} />
  );
}