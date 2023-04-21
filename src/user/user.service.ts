import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { editProfileDto } from './dto/editProfile.dto';
import { User } from './entities/user.entity';
import { sanitizeUser } from '../utils/sanitizeUser';
import { UserSport } from './entities/userSport.entity';
import UserSportDto from './dto/userSports.dto';
import { Role } from './entities/role.entity';
import { SportLevel } from '../sport/entities/sportLevel.entity';
import { Sport } from '../sport/entities/sport.entity';
import { UserResponse } from 'src/auth/dto/userResponse.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSport)
    private readonly userSportRepository: Repository<UserSport>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(SportLevel)
    private readonly sportLevelRepository: Repository<SportLevel>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOne(id, {
        relations: ['userSports', 'matches'],
      });
      return user;
    } catch (error) {
      console.log(error);
      throw error(error);
    }
  }

  // async findOrCreateGoogle(newUser: GoogleSignUpDto): Promise<any> {
  //   const { email } = newUser;
  //   const existingUser = await this.userRepository.findOne({ email });
  //   if (existingUser) {
  //     const updatedUser = { ...existingUser, ...newUser };
  //     const user = await this.userRepository.save(updatedUser);

  //     const {
  //       password,
  //       accessToken,
  //       refreshToken,
  //       passwordResetToken,
  //       passwordResetExpires,
  //       ...savedUser
  //     } = user;

  //     return savedUser;
  //   } else {
  //     const user = this.userRepository.create(newUser);
  //     user.accessToken = newUser.accessToken;
  //     const savedUser = this.userRepository.save(user);
  //     const sanitizedUser = {
  //       ...savedUser,
  //       password: undefined,
  //       accessToken: undefined,
  //     };
  //     return sanitizedUser;
  //   }
  // }

  // async deleteAccessToken(userId: number) {
  //   const user = await this.userRepository.findOne({ id: userId });
  //   if (!user) {
  //     throw new NotFoundException(`User with ${userId} not found`);
  //   }
  //   user.accessToken = null;
  //   await this.userRepository.save(user);
  // }

  async saveUser(user: User) {
    try {
      if (user.id) return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(userData: any): Promise<any> {
    let user = new User();
    user = { ...userData };
    try {
      const defaultRole = await this.roleRepository.findOne({ id: 1 });
      if (!defaultRole) {
        throw new Error('Default role not found');
      }
      user.role = defaultRole;
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
    const { name, lastName, age, gender } = userData;
    const updatedUser = {
      ...user,
      name: name ?? user.name,
      lastName: lastName ?? user.lastName,
      age: age ?? user.age,
      gender: gender ?? user.gender,
    };
    const rawUserData = await this.userRepository.save(updatedUser);
    return sanitizeUser(rawUserData);
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

  async addUserSports(
    body: { sportId: number; levelId: number },
    userId: number,
  ): Promise<any> {
    if (!userId) {
      throw new BadRequestException('Invalid userId');
    }

    try {
      const userSport = await this.userSportRepository.findOne({
        where: { user: userId },
      });
      const user = await this.userRepository.findOne(userId);
      const sport = await this.sportRepository.findOne(body.sportId);
      const level = await this.sportLevelRepository.findOne(body.levelId);

      if (userSport) {
        userSport.level = level;
        userSport.user = user;
        userSport.sport = sport;
        return await this.userSportRepository.save(userSport);
      } else {
        const newUserSport = new UserSport();
        newUserSport.sport = sport;
        newUserSport.user = user;
        newUserSport.level = level;
        return await this.userSportRepository.save(newUserSport);
      }
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
