import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getRepository } from 'typeorm';
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
    event.hostId = host;
    event.gender = eventDto.gender;
    event.price = eventDto.price;
    event.location = eventDto.location;
    event.dateTime = eventDto.dateTime;
    event.description = eventDto.description;
    event.participantsNumber = eventDto.participantsNumber;
    event.sport = sport;
    event.level = level;
    return this.eventRepository.save(event);
  }

  findAll() {
    return `This action returns all event`;
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
