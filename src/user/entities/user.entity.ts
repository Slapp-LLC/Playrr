import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  lastName: string;
  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  googleId: string;
}
