import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';
define(User, () => {
  const user = new User();

  user.name = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.gender = faker.name.sex();
  user.photoUrl = faker.internet.avatar();
  user.country = faker.address.country();
  user.bio = faker.lorem.paragraph();
  user.age = faker.datatype.number({ max: 40, min: 18 });
  return user;
});
