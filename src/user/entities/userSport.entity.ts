import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Sport } from '../../sport/entities/sport.entity';
import { SportLevel } from '../../sport/entities/sportLevel.entity';

@Entity()
export class UserSport {
  @ManyToOne(() => User, (user) => user.userSports, { primary: true })
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Sport, (sport) => sport.userSports, {
    primary: true,
    eager: true,
  })
  @JoinColumn({ name: 'sport' })
  sport: Sport;

  @ManyToOne(() => SportLevel, (sportLevel) => sportLevel.userSports, {
    eager: true,
  })
  @JoinColumn({ name: 'level' })
  level: SportLevel;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
