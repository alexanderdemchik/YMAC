import { getConnection, getRepository } from "typeorm";
import { Playlist } from "./entities/Playlist";
import { PlaylistTrack } from "./entities/PlaylistTrack";
import { Track } from "./entities/Track";
import * as playlistDb from "./playlist";
import * as tracksDb from "./tracks";

export const getTrackLikesIds = async (uid: number) => {
  const ids = (
    await getRepository(PlaylistTrack).find({
      playlistUid: uid,
      playlistKind: playlistDb.LIKE_PLAYLIST_KIND,
    })
  ).map((el) => el.trackId);
  return ids;
};

export const getTrackLikes = async (uid: number) => {
  const ids = await getTrackLikesIds(uid);
  return getRepository(Track)
    .createQueryBuilder("track")
    .where("track.id IN (:...ids)", { ids })
    .getMany();
};

export const removeTracksLikes = async (uid: number, trackIds: string[]) => {
  return getRepository(PlaylistTrack)
    .createQueryBuilder("pt")
    .where(
      "pt.trackId IN (:...trackIds) AND pt.playlistUid = :uid AND pt.playlistKind = :kind",
      { trackIds, uid, kind: playlistDb.LIKE_PLAYLIST_KIND }
    )
    .delete();
};

export const addTracksLikes = async (uid: number, tracks: Yandex.Track[]) => {
  await tracksDb.create(tracks);
  await playlistDb.assignTracksToPlaylist(tracks.map((el) => el.id), uid, playlistDb.LIKE_PLAYLIST_KIND);
};