import { Sport } from '../../sport/entities/sport.entity';
import { SportLevel } from '../../sport/entities/sportLevel.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventStatus } from '../enums/EventStatus.enum';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { GroupChat } from '../../chat/entities/groupChat.entity';
@Entity()
export class SportEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User)
  host: User;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  price: number;

  @Column()
  location: string;

  @CreateDateColumn({ nullable: true })
  creationDate: Date;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  description: string;

  @Column({ nullable: true })
  eventPhoto: string;

  @Column()
  spots: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.Scheduled })
  status: string;

  @ManyToOne(() => Sport, (sport) => sport.events)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  @JoinColumn({ name: 'players' })
  players: Ticket[];

  @ManyToOne(() => SportLevel, (level) => level.events, { eager: true })
  @JoinColumn({ name: 'level_id' })
  level: SportLevel;

  @OneToOne(() => GroupChat, (groupChat) => groupChat.event)
  @JoinColumn({ name: 'chat_id' })
  groupChat: GroupChat;
}
