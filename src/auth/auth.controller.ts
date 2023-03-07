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
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOAuth2,
  ApiTags,
} from '@nestjs/swagger';
import { ApiLogIn, ApiSignUp } from './documentation/api.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiSignUp()
  @ApiBody({ type: RegisterDto })
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

  @ApiLogIn()
  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
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
    return this.authService.forgotPassword(body.email);
  }
}
