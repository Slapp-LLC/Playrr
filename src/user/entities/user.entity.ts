import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';
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

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @OneToMany(() => UserSport, (userSports) => userSports.user)
  userSports: UserSport[];

  @ManyToOne(() => Role, (role) => role.user, { eager: true })
  @JoinColumn({ name: 'role' })
  role: Role;
}
