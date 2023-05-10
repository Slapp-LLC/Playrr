import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { SportEvent } from './entities/sportEvent.entity';
import { GroupChat } from 'src/chat/entities/groupChat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sport, SportLevel, SportEvent, GroupChat]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
