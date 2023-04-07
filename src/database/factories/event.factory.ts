// import { faker } from '@faker-js/faker';
// import { define } from 'typeorm-seeding';
// import { User } from 'src/user/entities/user.entity';
// import { Sport } from 'src/sport/entities/sport.entity';
// import { SportLevel } from 'src/sport/entities/sportLevel.entity';
// import { Event } from 'src/event/entities/event.entity';
// define(
//   Event,
//   (context: { users: User[]; sports: Sport[]; sportLevels: SportLevel[] }) => {
//     const event = new Event();
//     event.title = faker.lorem.words(5);
//     event.description = faker.lorem.paragraph();
//     event.startDate = faker.date.future();
//     event.endDate = faker.date.future();
//     event.spots = faker.datatype.number({ max: 20 });
//     event.gender = faker.helpers.arrayElement(['male', 'female', 'mixed']);
//     event.price = faker.datatype.float({ min: 0, max: 100, precision: 0.01 });
//     event.location = faker.address.city();
//     //Relaciones
//     event.host = faker.helpers.arrayElement(context.users);
//     event.sport = faker.helpers.arrayElement(context.sports);
//     event.level = faker.helpers.arrayElement(context.sportLevels);

//     return event;
//   },
// );
