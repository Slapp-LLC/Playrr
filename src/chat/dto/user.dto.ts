import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDTO } from './role.dto';

export class UserDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  lastName: string;
  @Expose()
  @Type(() => RoleDTO)
  role: RoleDTO;
  @Expose()
  photoUrl: string;
}
