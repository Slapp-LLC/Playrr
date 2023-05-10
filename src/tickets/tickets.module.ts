import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { SportEvent } from '../event/entities/sportEvent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, SportEvent, User])],
  controllers: [TicketController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule {}
