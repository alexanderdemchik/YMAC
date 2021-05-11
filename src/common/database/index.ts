import { createConnection } from "typeorm";
import { getUserDataPath } from "../utils";
import { Player } from "./entities/Player";
import path from 'path';
import { Playlist } from "./entities/Playlist";
import { PlaylistTrack } from "./entities/PlaylistTrack";
import { Track } from "./entities/Track";

const DB_NAME = 'data.db';

export const init = async () => {
  await createConnection({
    type: 'sqlite',
    database: path.join(await getUserDataPath(), DB_NAME),
    synchronize: true,
    entities: [Player, Playlist, PlaylistTrack, Track]
  });
};
