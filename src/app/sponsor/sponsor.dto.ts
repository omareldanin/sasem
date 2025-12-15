// sponsors/dto/create-sponsor.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SponsorType } from './sponsor.entity';

export class CreateSponsorDto {
  @IsEnum(SponsorType)
  type: SponsorType;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  eventId: number;
}

export class UpdateSponsorDto {
  @IsOptional()
  @IsEnum(SponsorType)
  type?: SponsorType;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  eventId: number;
}
