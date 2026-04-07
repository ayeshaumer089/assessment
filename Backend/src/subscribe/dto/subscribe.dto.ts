import { IsEmail, MaxLength } from 'class-validator';

export class SubscribeDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;
}

