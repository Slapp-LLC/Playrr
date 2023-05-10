import { Expose, Type } from 'class-transformer';
import { MessageDTO } from './message.dto';
import { UserDTO } from './user.dto';
import { RoleDTO } from './role.dto';
export class ChatDTO {
  @Expose()
  id: number;
  @Expose()
  @Type(() => MessageDTO)
  messages: Array<MessageDTO>;
  @Expose()
  @Type(() => UserDTO)
  participants: Array<UserDTO>;
}
