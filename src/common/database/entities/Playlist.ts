import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Track } from "./Track";

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column('text', { nullable: true })
  playlistUuid?: string

  @Column('int', { nullable: true })
  uid: number

  @Column('text', { nullable: true })
  title?: string;

  @Column('bigint', { nullable: true })
  revision?: number;

  @Column('int', { nullable: true })
  kind: number;

  @Column('bigint', { nullable: true })
  trackCount?: number;

  @Column('text', { nullable: true })
  ogImage?: string;

  @Column('simple-json', { nullable: true })
  cover?: any

  @Column('text', { nullable: true })
  description?: string

  tracks?: Track[]
}