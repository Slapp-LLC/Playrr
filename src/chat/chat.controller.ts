import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('myChats/:id')
  getChats(@Param('id') id: number) {
    return this.chatService.getAllUserChats(id);
  }
}
