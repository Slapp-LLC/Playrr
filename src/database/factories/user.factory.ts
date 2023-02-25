import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';
define(User, (faker: typeof Faker) => {
  const user = new User();
  user.name = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.age = faker.random.number({ min: 18, max: 40 });
  return user;
});
