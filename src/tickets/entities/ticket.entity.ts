import { SportEvent } from '../../event/entities/sportEvent.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEventStatus } from '../enum/user-event-status.enum';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.matches, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SportEvent, (sportEvent) => sportEvent.players, {
    eager: true,
  })
  @JoinColumn({ name: 'event' })
  event: SportEvent;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserEventStatus,
    default: UserEventStatus.Attending,
  })
  status: string;
}
