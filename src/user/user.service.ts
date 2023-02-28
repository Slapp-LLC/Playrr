import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';
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

  async findById(id: number): Promise<ResponseUserDto | undefined> {
    const user = await this.userRepository.findOne(id);
    const { password: _, ...result } = user;
    return result;
  }

  async findOrCreate(
    googleId: string,
    email: string,
    name: string,
    lastName: string,
  ): Promise<any> {
    let user = await this.userRepository.findOne({ googleId });
    if (!user) {
      user = this.userRepository.create({ googleId, email, name, lastName });
      await this.userRepository.save(user);
    }
    return user;
  }

  async createUser(userData: any): Promise<any> {
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.name = userData.name;
    user.lastName = userData.lastName;
    user.age = userData.age;
    try {
      const newUser = await this.userRepository.save(user);
      const { password: _, ...result } = newUser;
      return result;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
