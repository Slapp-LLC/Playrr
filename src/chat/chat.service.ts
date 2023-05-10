import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { SportEvent } from '../event/entities/sportEvent.entity';
import { UserChat } from './entities/userChat.entity';
import { ChatDTO } from './dto/chat.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(SportEvent)
    private readonly sportEventRepository: Repository<SportEvent>,
    @InjectRepository(UserChat)
    private readonly userChatRepository: Repository<UserChat>,
  ) {}

  async createUserChat(user1Id: number, user2Id: number): Promise<UserChat> {
    const user1 = await this.userRepository.findOne(user1Id);
    const user2 = await this.userRepository.findOne(user2Id);

    if (!user1 || !user2) {
      throw new NotFoundException('User not found');
    }

    const userChat = new UserChat();
    userChat.participants = [user1, user2];
    userChat.messages = [];

    return await this.userChatRepository.save(userChat);
  }

  async getUserChat(chatId: number): Promise<UserChat> {
    return await this.userChatRepository.findOne(chatId, {
      relations: ['participants', 'messages'],
    });
  }

  async findUserChatByUserIds(
    user1Id: number,
    user2Id: number,
  ): Promise<UserChat> {
    return await this.userChatRepository
      .createQueryBuilder('user_chat')
      .innerJoin('user_chat.participants', 'user1', 'user1.id = :user1Id', {
        user1Id,
      })
      .innerJoin('user_chat.participants', 'user2', 'user2.id = :user2Id', {
        user2Id,
      })
      .getOne();
  }
  async getMessagesByUserChat(chatId: number): Promise<Message[]> {
    const userChat = await this.getUserChat(chatId);
    return userChat ? userChat.messages : [];
  }
  async getAllUserChats(userId: number) {
    const chat = await this.userChatRepository
      .createQueryBuilder('userChat')
      .innerJoin('userChat.participants', 'user', 'user.id = :userId', {
        userId,
      })
      .leftJoinAndSelect('userChat.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender') // Add this line
      .leftJoinAndSelect('userChat.participants', 'participants')
      .getMany();
    const response: Array<ChatDTO> = plainToInstance(ChatDTO, chat, {
      strategy: 'excludeAll',
    });
    return response;
  }
  async createMessage(
    senderId: number,
    userChatId: number,
    content: string,
  ): Promise<Message> {
    const sender = await this.userRepository.findOne(senderId);
    const userChat = await this.getUserChat(userChatId);

    if (!sender || !userChat) {
      throw new NotFoundException('Sender or UserChat not found');
    }

    const message = new Message();
    message.content = content;
    message.sender = sender;
    message.userChat = userChat;

    return await this.messageRepository.save(message);
  }
}
