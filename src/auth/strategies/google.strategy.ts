import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

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
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, id } = profile;
    //TODO:Mejorar este metodo
    const user = await this.userService.findOrCreate(
      id,
      emails[0].value,
      name.givenName,
      name.familyName,
    );
    const payload = { email: emails[0].value, sub: user.id };
    const token = this.jwtService.sign(payload);
    done(null, { user, accessToken, token, refreshToken });
  }
}
