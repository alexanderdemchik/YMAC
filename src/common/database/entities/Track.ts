import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Track {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  realId: string;

  @Column('text')
  title: string;

  @Column('simple-json')
  major: string;

  @Column('text')
  storageDir: string;

  @Column('bigint')
  durationMs: number;

  @Column('simple-json')
  normalization: string;

  @Column('simple-json')
  artists: string;

  @Column('simple-json')
  albums: string;

  @Column('text')
  coverUri: string;

  @Column('text')
  ogImage: string;

  @Column('text')
  type: string;
}