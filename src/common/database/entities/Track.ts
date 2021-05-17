import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Track {
  @PrimaryColumn('text')
  id: string;

  @Column('text', { nullable: true })
  realId?: string;

  @Column('text', { nullable: true })
  title?: string;

  @Column('simple-json', { nullable: true })
  major?: string;

  @Column('text', { nullable: true })
  storageDir?: string;

  @Column('bigint', { nullable: true })
  durationMs?: number;

  @Column('simple-json', { nullable: true })
  normalization?: string;

  @Column('simple-json', { nullable: true })
  artists?: any;

  @Column('simple-json', { nullable: true })
  albums?: any;

  @Column('text', { nullable: true })
  coverUri?: string;

  @Column('text', { nullable: true })
  ogImage?: string;

  @Column('text', { nullable: true })
  type?: string;
}