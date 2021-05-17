import { getRepository } from "typeorm";
import { Playlist } from "./entities/Playlist";
import { PlaylistTrack } from "./entities/PlaylistTrack";
import { Track } from "./entities/Track";
import * as playlistDb from './playlist';

export const mapToDb = (tracks: Yandex.Track[]) : Track[] => {

  return tracks.map((track) => ({
    id: track.id,
    realId: track.realId,
    title: track.title,
    major: track.major,
    storageDir: track.storageDir,
    durationMs: track.durationMs,
    normalization: track.normalization,
    artists: track.artists,
    albums: track.albums,
    coverUri: track.coverUri,
    ogImage: track.ogImage,
    type: track.type
  }));
};

export const mapToBl = (tracks: Track[]) : Yandex.Track[] => {

  return tracks.map((track) => ({
    id: track.id,
    realId: track.realId,
    title: track.title,
    major: track.major,
    storageDir: track.storageDir,
    durationMs: track.durationMs,
    normalization: track.normalization,
    artists: track.artists,
    albums: track.albums,
    coverUri: track.coverUri,
    ogImage: track.ogImage,
    type: track.type
  }));
};

export const create = async (tracks: Yandex.Track[]) => {
  await getRepository(Track).save(tracks);
}

export const getLikesIds = async (uid: number) => {
  const ids = (await getRepository(PlaylistTrack).find({ playlistUid: uid, playlistKind: playlistDb.LIKE_PLAYLIST_KIND })).map((el) => el.trackId);
  return ids;
}

export const getLikes = async (uid: number) => {
  const ids = await getLikesIds(uid);
  return getRepository(Track, 'track').createQueryBuilder().where('track.id IN (:...ids)', { ids }).getMany()
}