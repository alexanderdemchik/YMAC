import { Column, Entity, PrimaryColumn } from "typeorm";
import { Track } from "./Track";

@Entity()
export class Playlist {
  @PrimaryColumn('text')
  playlistUuid: string;

  @Column('bigint')
  uid: number

  @Column('text')
  title: string;

  @Column('bigint')
  revision: number;

  @Column('int')
  kind: number;

  @Column('bigint')
  trackCount: number;

  @Column('text')
  ogImage: string;

  @Column('simple-json')
  cover: string

  tracks: Track[]
}