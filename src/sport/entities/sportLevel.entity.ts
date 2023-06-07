import { UserSport } from '../../user/entities/userSport.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SportEvent } from '../../event/entities/sportEvent.entity';
@Entity()
export class SportLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserSport, (userSport) => userSport.level)
  userSports: UserSport[];

  @OneToMany(() => SportEvent, (sportEvent) => sportEvent.level)
  events: SportEvent[];
}
