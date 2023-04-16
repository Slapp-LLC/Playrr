import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/user/entities/user.entity';
import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { Event } from './entities/event.entity';
import { EventStatus } from './enums/EventStatus.enum';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userReposity: Repository<User>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
    @InjectRepository(SportLevel)
    private readonly sportLevelRepository: Repository<SportLevel>,
  ) {}

  //Create event method
  async createEvent(eventDto: CreateEventDto): Promise<Event> {
    const host = await this.userReposity.findOne(eventDto.hostId);
    const sport = await this.sportRepository.findOne(eventDto.sportId);
    const level = await this.sportLevelRepository.findOne(eventDto.levelId);
    if (!host || !sport || !level) {
      throw new Error(
        'Failed to create event: One or more related entities not found',
      );
    }
    const event = new Event();
    event.title = eventDto.title;
    event.host = host;
    event.gender = eventDto.gender;
    event.price = eventDto.price;
    event.location = eventDto.location;
    event.startDate = eventDto.startDate;
    event.endDate = eventDto.endDate;
    event.description = eventDto.description;
    event.spots = eventDto.spots;
    event.sport = sport;
    event.level = level;
    return this.eventRepository.save(event);
  }

  async getAnEvent(id: number): Promise<any> {
    if (id) {
      const event = await this.eventRepository.findOne(id, {
        relations: ['host', 'level', 'sport'],
      });
      return event;
    } else {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllEvents(): Promise<any> {
    const sports = await this.eventRepository.find({
      relations: ['host', 'sport', 'level'],
    });
    return sports;
  }

  async getFilteredEvents(sportId?: number, sportLevel?: number): Promise<any> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.host', 'host')
      .leftJoinAndSelect('event.sport', 'sport')
      .leftJoinAndSelect('event.level', 'level');
    if (sportId) {
      query.andWhere('event.sportId = :sportId', { sportId });
    }
    if (sportLevel) {
      query.andWhere('event.levelId = :sportLevel', { sportLevel });
    }
    const events = await query.getMany();
    return events;
  }

  async deleteEvent(id: number, userId: number): Promise<any> {
    const event = await this.eventRepository.findOne(id, {
      relations: ['host'],
    });
    if (event.host.id === userId) {
      await this.eventRepository.delete(id);
      return {
        status: HttpStatus.NO_CONTENT, // or HttpStatus.OK if you want to return 200
        message: 'Event deleted successfully',
      };
    } else {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }
  }

  async updateEventStatus(
    id: number,
    userId: number,
    newStatus: EventStatus,
  ): Promise<any> {
    const event = await this.eventRepository.findOne(id, {
      relations: ['host'],
    });
    if (!event) {
      throw new HttpException('Not found resource', HttpStatus.NOT_FOUND);
    }
    if (event.host.id === userId) {
      event.status = newStatus;
      const updatedEvent = await this.eventRepository.save(event);
      return updatedEvent;
    } else {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }
  }
}
//TODO Implement create event service
//Todo Implement delete event service
//Todo Implement edit event service
