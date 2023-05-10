import { UserSport } from '../../user/entities/userSport.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SportEvent } from '../../event/entities/sportEvent.entity';
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

  @OneToMany(() => SportEvent, (sportEvent) => sportEvent.sport)
  events: SportEvent[];
}
