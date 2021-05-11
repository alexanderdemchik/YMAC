import { getRepository } from "typeorm";
import { Track } from "./entities/Track";

export const create = async (tracks: Track[]) => {
  await getRepository(Track).save(tracks);
}