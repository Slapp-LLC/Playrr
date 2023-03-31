import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/user/entities/user.entity';
import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { Event } from './entities/event.entity';
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

  async getAllEvents(): Promise<any> {
    const sports = await this.eventRepository.find({
      relations: ['host', 'sport', 'level'],
    });
    return sports;
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

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
//TODO Implement create event service
//Todo Implement delete event service
//Todo Implement edit event service
