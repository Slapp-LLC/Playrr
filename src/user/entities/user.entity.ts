import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';

import { Exclude } from 'class-transformer';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { UserSport } from './userSport.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Exclude()
  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  country: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetToken: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetExpires: Date;

  @OneToMany(() => UserSport, (userSports) => userSports.user)
  @JoinColumn({ name: 'sports' })
  userSports: UserSport[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  @JoinColumn({ name: 'matches' })
  matches: Ticket[];

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  @JoinColumn({ name: 'role' })
  role: Role;
}
