import { getRepository } from "typeorm";
import { Playlist } from "./entities/Playlist";
import { PlaylistTrack } from "./entities/PlaylistTrack";

const LIKE_PLAYLIST_KIND = 1;
const DISLIKE_PLAYLIST_KIND = 2;


const create = async (playlist: Partial<Playlist>) => {
  await getRepository(Playlist).save(playlist);
};

const getByUidAndKind = async (uid: number, kind: number) => {
  return getRepository(Playlist).findOne({ uid, kind });
};

const getById = async (id: string) => {
  return getRepository(Playlist).findOne({ playlistUuid: id });
};

const assignTracksToPlaylist = async (trackIds: string[], playlistId: string) => {
  getRepository(PlaylistTrack).save(trackIds.map((el) => ({ trackId: el, playlistId })));
};
