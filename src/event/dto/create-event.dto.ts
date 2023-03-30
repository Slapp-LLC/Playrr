export class CreateEventDto {
  title: string;
  hostId: number; // Use the hostId (number) instead of the User entity
  gender?: string;
  price?: number;
  location: string;
  dateTime: Date;
  description: string;
  participantsNumber: number;
  sportId: number; // Use the sportId (number) instead of the Sport entity
  levelId: number; // Use the levelId (number) instead of the SportLevel entity
}
