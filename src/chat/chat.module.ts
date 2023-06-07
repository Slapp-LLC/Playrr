import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { SportEvent } from '../event/entities/sportEvent.entity';
import { GroupChat } from './entities/groupChat.entity';
import { UserChat } from './entities/userChat.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, GroupChat, SportEvent, UserChat]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService, ConfigService],
})
export class ChatModule {}
