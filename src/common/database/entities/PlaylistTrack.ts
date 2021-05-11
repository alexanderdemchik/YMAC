import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['playlistId', 'trackId'], { unique: true })
export class PlaylistTrack {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  playlistId: string;

  @Column('text')
  trackId: string;
}
