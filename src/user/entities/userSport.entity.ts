import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSport {
  @ManyToOne(() => User, (user) => user.userSports, { primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Sport, (sport) => sport.userSports, { primary: true })
  @JoinColumn({ name: 'sportId' })
  sport: Sport;

  @ManyToOne(() => SportLevel, (sportLevel) => sportLevel.userSports)
  @JoinColumn({ name: 'levelId' })
  level: SportLevel;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  sportId: number;

  @Column()
  levelId: number;
}
