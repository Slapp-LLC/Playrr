import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly name?: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly lastName?: string;

  @ApiProperty()
  @ApiProperty()
  @IsNotEmpty()
  readonly password?: string;

  @ApiProperty()
  readonly age?: number;

  @ApiProperty()
  readonly photoUrl?: string;

  @ApiProperty()
  readonly bio?: string;

  @ApiProperty()
  readonly gender?: string;
}
