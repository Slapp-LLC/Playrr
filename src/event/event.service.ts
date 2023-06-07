import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/user/entities/user.entity';
import { Sport } from 'src/sport/entities/sport.entity';
import { SportLevel } from 'src/sport/entities/sportLevel.entity';
import { SportEvent } from './entities/sportEvent.entity';
import { EventStatus } from './enums/EventStatus.enum';
import { GroupChat } from 'src/chat/entities/groupChat.entity';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(SportEvent)
    private readonly sportEventRepository: Repository<SportEvent>,
    @InjectRepository(User)
    private readonly userReposity: Repository<User>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
    @InjectRepository(SportLevel)
    private readonly sportLevelRepository: Repository<SportLevel>,
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
  ) {}

  //Create event method
  async createEvent(eventDto): Promise<SportEvent> {
    const host = await this.userReposity.findOne(eventDto.hostId);
    const sport = await this.sportRepository.findOne(eventDto.sport_id);
    const level = await this.sportLevelRepository.findOne(eventDto.level_id);
    if (!host || !sport || !level) {
      throw new Error(
        'Failed to create event: One or more related entities not found',
      );
    } else {
      const sportEvent = new SportEvent();
      sportEvent.title = eventDto.title;
      sportEvent.host = host;
      sportEvent.gender = eventDto.gender;
      sportEvent.price = eventDto.price;
      sportEvent.location = eventDto.location;
      sportEvent.startDate = eventDto.startDate;
      sportEvent.endDate = eventDto.endDate;
      sportEvent.description = eventDto.description;
      sportEvent.spots = eventDto.spots;
      sportEvent.sport = sport;
      sportEvent.level = level;
      // Create a new GroupChat instance and add the event host as a participant.
      const groupChat = new GroupChat();
      groupChat.participants = [host];

      // Save the group chat instance.
      const savedGroupChat = await this.groupChatRepository.save(groupChat);
      // Assign the saved group chat instance to the event.
      sportEvent.groupChat = savedGroupChat;
      const savedSportEvent = await this.sportEventRepository.save(sportEvent);

      return savedSportEvent;
    }
  }

  async getAnEvent(id: number) {
    if (id) {
      if (id) {
        const event = await this.sportEventRepository
          .createQueryBuilder('event')
          .leftJoinAndSelect('event.host', 'host')
          .leftJoinAndSelect('event.level', 'level')
          .leftJoinAndSelect('event.sport', 'sport')
          .leftJoin('event.players', 'players')
          .addSelect(['players.id', 'players.createdAt', 'players.status'])
          .leftJoin('players.user', 'user')
          .addSelect(['user.id', 'user.name', 'user.lastName', 'user.photoUrl'])
          .leftJoinAndSelect('event.groupChat', 'groupChat') // Add this line
          .where('event.id = :id', { id })
          .getOne();

        return event;
      } else {
        throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllEvents(): Promise<any> {
    const sports = await this.sportEventRepository.find({
      relations: ['host', 'sport', 'level', 'players'],
    });
    return sports;
  }

  async getFilteredEvents(sportId?: number, sportLevel?: number): Promise<any> {
    const query = this.sportEventRepository
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
    const event = await this.sportEventRepository.findOne(id, {
      relations: ['host'],
    });
    if (event.host.id === userId) {
      await this.sportEventRepository.delete(id);
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
    const event = await this.sportEventRepository.findOne(id, {
      relations: ['host'],
    });
    if (!event) {
      throw new HttpException('Not found resource', HttpStatus.NOT_FOUND);
    }
    if (event.host.id === userId) {
      event.status = newStatus;
      const updatedEvent = await this.sportEventRepository.save(event);
      return updatedEvent;
    } else {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }
  }
}
//TODO Implement create event service
//Todo Implement delete event service
//Todo Implement edit event service
