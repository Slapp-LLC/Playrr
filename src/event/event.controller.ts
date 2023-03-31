import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventStatusDto } from './dto/updateStatus-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/role-auth.guard';
import { EventStatus } from './enums/EventStatus.enum';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  createEvent(@Body() createEventData: CreateEventDto) {
    return this.eventService.createEvent(createEventData);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // Use the ClassSerializerInterceptor
  getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles(4)
  @UseInterceptors(ClassSerializerInterceptor) // Use the ClassSerializerInterceptor
  @Delete('delete/:id')
  deleteEvent(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.eventService.deleteEvent(+id, +userId);
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles(2, 4)
  @UseInterceptors(ClassSerializerInterceptor) //
  @Patch(':id/cancel')
  async cancelEvent(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.eventService.updateEventStatus(
      +id,
      userId,
      EventStatus.Cancelled,
    );
  }

  //Todo This method should take new startDate and endDate in body
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles(2, 4)
  @UseInterceptors(ClassSerializerInterceptor) //
  @Patch(':id/delay')
  async delayEvent(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.eventService.updateEventStatus(
      +id,
      userId,
      EventStatus.Postponed,
    );
  }

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Roles(2, 4)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/eschedule')
  async escheduleEvent(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.eventService.updateEventStatus(
      +id,
      userId,
      EventStatus.Scheduled,
    );
  }
}
