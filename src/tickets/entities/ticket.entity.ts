import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
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
  @ManyToOne(() => User, (user) => user.matches)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Event, (event) => event.players)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserEventStatus,
    default: UserEventStatus.Attending,
  })
  status: string;
}
