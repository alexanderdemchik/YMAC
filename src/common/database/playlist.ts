import { getConnection, getRepository } from "typeorm";
import { Playlist } from "./entities/Playlist";
import { PlaylistTrack } from "./entities/PlaylistTrack";
import { v4 } from 'uuid';
import { Track } from "./entities/Track";
import { mapToBl as mapTracksToBl } from './tracks';

export const LIKE_PLAYLIST_KIND = 1;
export const DISLIKE_PLAYLIST_KIND = 2;

export const mapToBl = (playlists: Playlist[]): Yandex.Playlist[] => {
  return playlists.map((p) => ({
    playlistUuid: p.playlistUuid,
    revision: p.revision,
    uid: p.uid,
    kind: p.kind,
    title: p.title,
    description: p.description,
    trackCount: p.trackCount,
    ogImage: p.ogImage,
    cover: p.cover,
    tracks: mapTracksToBl(p.tracks!)
  }));
}

export const create = async (playlist: Partial<Playlist>) => {
  return getRepository(Playlist).save(playlist);
};

export const createIfNeed = async (playlist: Partial<Playlist>) => {
  if ([LIKE_PLAYLIST_KIND, DISLIKE_PLAYLIST_KIND].includes(playlist.kind!)) {
    const playlistDb = await getByUidAndKind(playlist.uid!, playlist.kind!);

    if (playlistDb) {
      return playlistDb;
    }
  }

  return create(playlist);
}

export const getByUidAndKind = async (uid: number, kind: number) => {
  return getRepository(Playlist).findOne({ uid, kind });
};

export const getByUidAndKindWithTracks = async (uid: number, kind: number) => {
  const playlist = await getRepository(Playlist).findOne({ uid, kind });

  if (playlist) {
    const trackIds = (await getRepository(PlaylistTrack).find({ playlistUid: playlist.uid, playlistKind: playlist.kind })).map((el) => el.trackId);

    const tracks = await getRepository(Track).createQueryBuilder('track').where('track.id IN (:...trackIds)', { trackIds }).getMany();

    playlist.tracks = tracks;

    return mapToBl([playlist])[0];
  }

  return null;
};

export const getById = async (id: string) => {
  return getRepository(Playlist).findOne({ playlistUuid: id });
};

export const assignTracksToPlaylist = async (trackIds: string[], playlistUid: number, playlistKind: number) => {
  getConnection().createQueryBuilder()
    .insert()
    .into(PlaylistTrack)
    .values(trackIds.map((el) => ({ trackId: el, playlistUid, playlistKind })))
    .onConflict('DO NOTHING')
    .execute()
};
