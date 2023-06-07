import { Expose, Type } from 'class-transformer';
import { UserDTO } from './user.dto';
import { UserChatDTO } from './userChat.dto';

export class MessageDTO {
  @Expose()
  id: number;
  @Expose()
  content: string;
  @Expose()
  createdAt: Date;
  @Expose()
  @Type(() => UserDTO)
  sender: UserDTO;
  @Expose()
  @Type(() => UserChatDTO)
  userChat: UserChatDTO;
}
