import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketsService) {}

  @ApiOperation({ summary: 'Join An Event' })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async joinSport(@Body() ticketData, @Request() req) {
    return ticketData;
  }
}
