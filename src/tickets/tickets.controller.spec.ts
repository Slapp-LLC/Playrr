import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let controller: TicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [TicketsService],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
