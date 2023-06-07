import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  ClassSerializerInterceptor,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtWsAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Message } from './entities/message.entity';
import { MessageDTO } from './dto/message.dto';
import { plainToClass } from 'class-transformer';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(): void {
    this.logger.debug(`Chat gateway initiated`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(
        client.handshake.query.token.toString(),
        { secret: jwtSecret },
      );
      client.emit('events', 'Connected');
      client.join(`global_chat_${payload.sub}`);
      this.logger.debug(`Client connected: ${client.id}`);
    } catch (error) {
      client.emit('unauthorized', 'Invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected:${client.id}`);
  }

  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('joinUserChat')
  async handleJoinUserChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('payload') payload,
  ) {
    const { userId, user2Id } = payload;
    if (userId === undefined || user2Id === undefined) {
      client.emit('chat', 'User IDs not provided');
    } else {
      const chat = await this.chatService.findUserChatByUserIds(
        userId,
        user2Id,
      );
      if (!chat) {
        client.emit('chat', 'No chat');
      } else {
        client.emit('chat', 'Hay chat');
        console.log(chat);
      }
    }
  }

  @SubscribeMessage('joinPublicEventChat')
  async handleJoinPublicEventChat(client: Socket, data: { eventId: number }) {
    const { eventId } = data;
  }

  @SubscribeMessage('getEventChatMessages')
  async handleGetEventChatMessages(client: Socket, data: { chatId: number }) {
    const { chatId } = data;
    // const messages = await this.chatService.getChatMessages(chatId);
    // client.emit('eventChatMessages', messages);
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('data')
    data: {
      senderId: number;
      receiverId: number;
      content: string;
    },
  ) {
    console.log(data);
    const { senderId, receiverId, content } = data;
    try {
      let chat = await this.chatService.findUserChatByUserIds(
        senderId,
        receiverId,
      );

      if (!chat) {
        chat = await this.chatService.createUserChat(senderId, receiverId);
        client.emit('events', 'Chatroom not found');
      }

      const messageEntity: Message = await this.chatService.createMessage(
        senderId,
        chat.id,
        content,
      );
      console.log(messageEntity);
      const messageDTO: MessageDTO = plainToClass(MessageDTO, messageEntity, {
        strategy: 'excludeAll',
      });

      client.emit('events', 'Chatroom found!');
      this.server.to(`global_chat_${senderId}`).emit('message', messageDTO);
      this.server.to(`global_chat_${receiverId}`).emit('message', messageDTO);
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('events', 'Error sending message');
    }
  }
}
