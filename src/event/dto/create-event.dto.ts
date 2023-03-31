import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  hostId: number; // Use the hostId (number) instead of the User entity

  @IsOptional()
  gender?: string;

  @IsOptional()
  price?: number;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  spots: number;

  @IsNotEmpty()
  sportId: number; // Use the sportId (number) instead of the Sport entity

  @IsNotEmpty()
  levelId: number; // Use the levelId (number) instead of the SportLevel entity
}
