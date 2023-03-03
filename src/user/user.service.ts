import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { editProfileDto } from './dto/editProfile.dto';
import { GoogleSignUpDto } from './dto/googleSignUp.dto';
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

  async findOrCreate(newUser: GoogleSignUpDto): Promise<any> {
    const { googleId } = newUser;
    const user = await this.userRepository.findOne({ googleId: googleId });
    if (!user) {
      newUser = this.userRepository.create(newUser);
      return await this.userRepository.save(newUser);
    }
    return user;
  }

  async createUser(userData: any): Promise<any> {
    let user = new User();
    user = { ...userData };
    try {
      const newUser = await this.userRepository.save(user);
      const { password: _, ...result } = newUser;
      return result;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  async editUser(
    userId: number,
    userData: editProfileDto,
    user: User,
  ): Promise<any> {
    if (+userId !== +user.id) {
      throw new UnauthorizedException(
        'You are not authorized to edit this profile',
      );
    }

    const { name, lastName, age } = userData;

    const updatedUser = {
      ...user,
      name: name ?? user.name,
      lastName: lastName ?? user.lastName,
      age: age ?? user.age,
    };

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(userId: number, user: User): Promise<any> {
    if (+userId !== +user.id) {
      throw new UnauthorizedException(
        'You are not authorized to edit this profile',
      );
    }
    try {
      this.userRepository.delete(userId);
      return;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
