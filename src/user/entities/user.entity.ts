import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { UserSport } from './userSport.entity';
import { Exclude } from 'class-transformer';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @Exclude()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  age: number;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  @Exclude()
  gender: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ nullable: true })
  @Exclude()
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
