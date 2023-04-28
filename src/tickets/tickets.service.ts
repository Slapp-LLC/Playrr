import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Connection, Repository } from 'typeorm';
import { Event } from '../event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async getMyTickets(userId: number) {
    const events = await this.ticketRepository.find({
      where: { user: userId },
    });
    return events;
  }

  async createTicket(userId: number, eventId: number) {
    try {
      const event = await this.eventRepository.findOne(eventId);
      const user = await this.userRepository.findOne(userId);
      const tickets = await this.ticketRepository.find({
        where: {
          event: eventId,
        },
      });
      const myTicket = await this.ticketRepository.findOne({
        where: {
          user: userId,
          event: eventId,
        },
      });
      if (!myTicket && tickets.length < event.spots) {
        const newTicket = new Ticket();
        newTicket.event = event;
        newTicket.user = user;
        await this.ticketRepository.save(newTicket);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
