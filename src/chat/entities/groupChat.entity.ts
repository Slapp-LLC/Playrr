import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { SportEvent } from '../../event/entities/sportEvent.entity';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity()
export class GroupChat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => SportEvent, (sportEvent) => sportEvent.groupChat)
  @JoinColumn()
  event: SportEvent;

  @ManyToMany(() => User, (user) => user.groupChats)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.groupChat)
  messages: Message[];
}
