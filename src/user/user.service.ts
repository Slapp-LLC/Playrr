import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async createUser(userData: any): Promise<User> {
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.name = userData.name;
    user.lastName = userData.lastName;
    user.age = user.age;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
