import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Player {
  @PrimaryColumn({ type: 'bigint', unique: true })
  userId: number

  @Column('simple-json')
  queue: any;

  @Column({type: 'simple-json', nullable: true})
  current: Yandex.Track | null;

  @Column('simple-json')
  history: any;

  @Column('boolean')
  playing: boolean;

  @Column('boolean')
  shuffle: boolean;

  @Column('float')
  played: number;

  @Column('float')
  buffered: number;

  @Column('float')
  volume: number;

  @Column('float')
  duration: number;

  @Column('boolean')
  muted: boolean;
}