import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/LocalRegister.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() user: RegisterDto): Promise<any> {
    const newUser = await this.authService.register(user);
    return await this.authService.login(newUser);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req): Promise<any> {
    const { user, accessToken, token } = req.user;
    console.log(req.user);
    return {
      user,
      accessToken,
      token,
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

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req, @Res() res: Response): Promise<void> {
    const { accessToken, id } = req.user;
    await this.authService.logOut(accessToken, id);
    req.logout(() => {
      res.status(200).json({ message: 'Logged Out Successfully' });
    });
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    this.authService.forgotPassword(body.email);
  }
}
