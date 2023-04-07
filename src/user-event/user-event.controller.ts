import { Controller } from '@nestjs/common';
import { UserEventService } from './user-event.service';

@Controller('user-event')
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}
}
