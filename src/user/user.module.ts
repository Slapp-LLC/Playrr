import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSport } from './entities/userSport.entity';
import { Role } from './entities/role.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { Sport } from 'src/sport/entities/sport.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSport, Role, SportLevel, Sport]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
