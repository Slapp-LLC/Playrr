// userChat.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class UserChatDTO {
  @Expose()
  id: number;
}
