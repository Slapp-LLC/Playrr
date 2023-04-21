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
    private readonly connection: Connection,
  ) {}

  async getMyTickets(userId: number) {
    const events = await this.ticketRepository.find({
      where: { user: userId },
    });
    return events;
  }

  async createTicket(userId: number, eventId: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Find the event and lock the row to prevent concurrent modifications
      const event = await queryRunner.manager.findOne(Event, eventId, {
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }

      // Check if the user already has a ticket for this event
      const existingTicket = await this.ticketRepository.findOne({
        where: { event: eventId, user: userId },
      });
      if (existingTicket) {
        throw new BadRequestException(
          `You already have a ticket for this event`,
        );
      }

      // Check if there are available spots
      const numTickets = await this.ticketRepository.count({
        where: { event: eventId },
      });
      if (numTickets >= event.spots) {
        throw new BadRequestException(
          `No more tickets available for this event`,
        );
      }

      //Todo Fix this!
      // Create a new ticket
      const newTicket = new Ticket();
      newTicket.user = { id: userId } as User;
      newTicket.event = event;
      await queryRunner.manager.save(newTicket);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return newTicket;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
