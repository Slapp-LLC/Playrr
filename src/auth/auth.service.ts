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
import { sanitizeUser } from '../utils/sanitizeUser';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { checkExistingUser } from 'src/utils/user.utils';
import {
  createLoginResponse,
  createUserAndSanitize,
} from 'src/utils/auth-utils';
//TODO: All User Methods move to Users Services
@Injectable()
export class AuthService {
  private readonly client: OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: AuthMailerService,
  ) {
    this.client = new OAuth2Client({
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_KEY'),
    });
  }

  async register(userData: RegisterDto): Promise<any> {
    try {
      await checkExistingUser(this.usersService, userData.email);
      return await createUserAndSanitize(this.usersService, userData);
    } catch (error) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  async login(user: any) {
    return await createLoginResponse(this.jwtService, this.usersService, user);
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
  async logOut(accessToken: string, id: number): Promise<any> {
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
