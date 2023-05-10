import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponse {
  @Expose()
  readonly name: string;
  @Expose()
  readonly id: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly bio: string;

  @Expose()
  readonly country: string;

  @Exclude()
  readonly email: string;

  @Exclude()
  readonly age: number;

  @Expose()
  readonly photoUrl: string;

  @Exclude()
  readonly gender: string;
}
