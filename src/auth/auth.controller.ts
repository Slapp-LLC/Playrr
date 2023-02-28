import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() user: RegisterDto): Promise<User> {
    return this.authService.register(user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthRedirect(@Req() req): Promise<any> {
    const { access_token, token, user } = req.user;
    return {
      token,
      user,
      access_token,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
