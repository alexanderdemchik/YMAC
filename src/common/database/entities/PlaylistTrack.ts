import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['playlistUid', 'playlistKind', 'trackId'], { unique: true })
export class PlaylistTrack {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  playlistUid: number;

  @Column('int')
  playlistKind: number;

  @Column('text')
  trackId: string;
}
