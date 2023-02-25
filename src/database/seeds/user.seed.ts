import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';

export class UserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().createMany(15);
  }
}
