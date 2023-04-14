import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from 'src/auth/dto/userResponse.dto';
import { getConnection, getRepository, Repository } from 'typeorm';
import { editProfileDto } from './dto/editProfile.dto';
import { GoogleSignUpDto } from './dto/googleSignUp.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { User } from './entities/user.entity';
import { sanitizeUser } from '../utils/sanitizeUser';
import { UserSport } from './entities/userSport.entity';
import UserSportDto from './dto/userSports.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSport)
    private readonly userSportRepository: Repository<UserSport>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<ResponseUserDto | undefined> {
    const user = await this.userRepository.findOne(id, {
      relations: ['userSports', 'matches'],
    });
    if (user.password) {
      const { password: _, ...result } = user;
      return result;
    }
    return user;
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
    userSports: UserSportDto[],
    userId: number,
  ): Promise<any> {
    if (!userId) {
      throw new BadRequestException('Invalid userId');
    }
    if (
      !Array.isArray(userSports) ||
      userSports.some(
        (sport) =>
          !sport ||
          typeof sport !== 'object' ||
          !sport.sportId ||
          !sport.levelId,
      )
    ) {
      throw new BadRequestException('Invalid userSports');
    }

    if (userSports.length) {
      try {
        for (const { sportId, levelId } of userSports) {
          const userSport = await this.userSportRepository.findOne({
            where: { userId, sportId },
          });
          if (userSport) {
            userSport.levelId = levelId;
            await this.userSportRepository.save(userSport);
          } else {
            const newUserSport = new UserSport();
            newUserSport.userId = userId;
            newUserSport.sportId = sportId;
            newUserSport.levelId = levelId;
            await this.userSportRepository.save(newUserSport);
          }
        }
        return;
      } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    }
  }
}
