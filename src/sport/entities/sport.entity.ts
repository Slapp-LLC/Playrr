import { UserSport } from 'src/user/entities/userSport.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  iconUrl: string;

  @OneToMany(() => UserSport, (userSport) => userSport.sport)
  userSports: UserSport[];

  @OneToMany(() => Event, (event) => event.sport)
  events: Event[];
}
