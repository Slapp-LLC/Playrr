import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
//TODO: All User Methods move to Users Services
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  //TODO add login service after registering
  async register(userData: RegisterDto): Promise<any> {
    const user = await this.usersService.findByEmail(userData.email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    try {
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const formatedUser = { ...userData, password: hashedPassword };
        const newUser = await this.usersService.createUser(formatedUser);

        return newUser;
      } else {
        throw new Error(`Contraseña sin completar`);
      }
    } catch (error) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    const userData = await this.usersService.findById(payload.sub);
    return {
      userData,
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid Credentials');
    }
    return user;
  }

  async validateById(id: number): Promise<any> {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
