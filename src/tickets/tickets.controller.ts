import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketsService) {}

  @ApiOperation({ summary: 'Join An Event' })
  @UseGuards(JwtAuthGuard)
  @Post('/join')
  async joinSport(@Body() ticketData: CreateTicketDto, @Request() req) {
    return this.ticketService.createTicket(req.user.id, ticketData.eventId);
  }

  @ApiOperation({ summary: 'Get my matches' })
  @UseGuards(JwtAuthGuard)
  @Get('myMatches')
  async getMyMatches(@Request() req) {
    return this.ticketService.getMyTickets(req.user.id);
  }
}
