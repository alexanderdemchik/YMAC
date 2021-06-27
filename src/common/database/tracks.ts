import { getRepository } from "typeorm";

import { Track } from "./entities/Track";

export const mapToDb = (tracks: Yandex.Track[]): Track[] => {
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
    type: track.type,
  }));
};

export const mapToBl = (tracks: Track[]): Yandex.Track[] => {
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
    type: track.type,
  }));
};

export const create = async (tracks: Yandex.Track[]) => {
  await getRepository(Track).save(tracks);
};
