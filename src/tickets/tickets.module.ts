import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from '../event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event, User])],
  controllers: [TicketController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule {}
