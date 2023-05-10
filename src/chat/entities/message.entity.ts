import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { GroupChat } from './groupChat.entity';
import { UserChat } from './userChat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages, {
    nullable: true,
  })
  groupChat: GroupChat;

  @ManyToOne(() => UserChat, (userChat) => userChat.messages, {
    nullable: true,
  })
  userChat: UserChat;
}
