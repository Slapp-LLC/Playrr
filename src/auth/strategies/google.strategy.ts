import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_KEY'),
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email', 'openid'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { given_name, family_name, email, sub, picture } = profile._json;
    const newUser = {
      name: given_name,
      email: email,
      googleId: sub,
      photoUrl: picture,
      lastName: family_name,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    const user = await this.userService.findOrCreateGoogle(newUser);
    const payload = { email: email, sub: user.id };
    const token = this.jwtService.sign(payload);
    done(null, { user, token });
  }
}
