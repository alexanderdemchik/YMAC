import { getRepository } from "typeorm";
import { PlayerState } from '../../renderer/redux/player';
import logger from "../logger";
import { Player } from "./entities/Player";

export const create = async (userId: number, playerState: Partial<PlayerState>) => {
  await getRepository(Player).save({...playerState, userId});
}

export const getByUserId = async (userId: number) : Promise<PlayerState | undefined> => {
  const res = await getRepository(Player).findOne({ where: { userId } });

  if (!res) return undefined;

  return {
    playing: res.playing,
    queue: res.queue,
    history: res.history,
    current: res.current,
    shuffle: res.shuffle,
    played: res.played,
    buffered: res.buffered,
    volume: res.volume,
    duration: res.duration,
    muted: res.muted
  }
}

export const update = async (userId: number, playerState: Partial<PlayerState>) => {
  await getRepository(Player).update(userId, {...playerState, userId});
}

