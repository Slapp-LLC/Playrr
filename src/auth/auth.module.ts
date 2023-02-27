import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';

import { UserModule } from '../user/user.module'; // <-- import UserModule here
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'perritotriste',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
