import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User)
  hostId: User;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  price: number;

  @Column()
  location: string;

  @Column()
  dateTime: Date;

  @Column()
  description: string;

  @Column()
  participantsNumber: number;

  @ManyToOne(() => Sport, (sport) => sport.events)
  @JoinColumn({ name: 'sportId' })
  sport: Sport;

  @ManyToOne(() => SportLevel, (level) => level.events)
  @JoinColumn({ name: 'levelId' })
  level: SportLevel;
}
