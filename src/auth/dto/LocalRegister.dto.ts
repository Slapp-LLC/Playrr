import { IsNotEmpty, IsEmail } from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly age: number;

  readonly photoUrl: string;

  readonly bio: string;

  readonly gender: string;
}
