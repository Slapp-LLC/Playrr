import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/LocalRegister.dto';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthMailerService } from './mailer.service';
import axios from 'axios';
import { sanitizeUser } from '../auth/utils/sanitizeUser';
//TODO: All User Methods move to Users Services
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: AuthMailerService,
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
        return sanitizeUser(newUser);
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
    const sanitizeData = sanitizeUser(userData);
    return {
      user: sanitizeData,
      token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    if (password && user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new BadRequestException('Invalid Credentials');
      }
      return user;
    }
    throw new BadRequestException('Invalid Credentials');
  }

  async validateById(id: number): Promise<any> {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  //Todo implement function to update accessToken
  async logOut(accessToken: string, id: string): Promise<any> {
    if (accessToken) {
      await this.revokeToken(accessToken);
      await this.usersService.deleteAccessToken(id);
    }
    return { message: 'Logged Out Succesfully' };
  }

  async revokeToken(accessToken: string) {
    try {
      await axios({
        method: 'post',
        url: 'https://oauth2.googleapis.com/revoke',
        params: {
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(`Error revoking token: ${error.message}`);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password !== null) {
      const payload = { email: user.email, sub: user.id };
      const options = { expiresIn: '1h' };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, options);
      user.passwordResetToken = token;
      user.passwordResetExpires = new Date(Date.now() + 3600000);
      try {
        await this.usersService.saveUser(user);
        await this.mailerService.sendPasswordResetEmail(user.email, token);
        return { message: 'Email sent' };
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'User not found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async resetPassword(token: string, password: string) {
    const decodedToken: jwt.JwtPayload = jwt.decode(token) as jwt.JwtPayload;
    const user = await this.usersService.findByEmail(decodedToken.email);
    if (
      user.passwordResetToken !== token ||
      user.passwordResetExpires < new Date()
    ) {
      throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.usersService.saveUser(user);
    return { message: 'Password updatedSuccessfuly' };
  }
}
