import { UserSport } from 'src/user/entities/userSport.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
@Entity()
export class SportLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserSport, (userSport) => userSport.level)
  userSports: UserSport[];

  @OneToMany(() => Event, (event) => event.level)
  events: Event[];
}
