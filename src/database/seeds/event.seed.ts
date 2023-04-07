// import { Connection } from 'typeorm';
// import { Seeder, Factory } from 'typeorm-seeding';
// import { Event } from 'src/event/entities/event.entity';
// import { User } from 'src/user/entities/user.entity';
// import { Sport } from 'src/sport/entities/sport.entity';
// import { SportLevel } from 'src/sport/entities/sportLevel.entity';

// export class EventSeed implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<void> {
//     const users = await connection.getRepository(User).find();
//     const sports = await connection.getRepository(Sport).find();
//     const sportLevels = await connection.getRepository(SportLevel).find();
//     await factory(Event)({ users, sports, sportLevels }).createMany(30);
//   }
// }
