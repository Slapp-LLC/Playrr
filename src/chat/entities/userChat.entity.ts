import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity()
export class UserChat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.userChats)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.userChat)
  messages: Message[];
}
