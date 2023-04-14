import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketController } from './tickets.controller';

@Module({
  controllers: [TicketController],
  providers: [TicketsService],
})
export class TicketModule {}
