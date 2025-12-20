// sponsors/dto/create-sponsor.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SponsorType } from './sponsor.entity';
import { Transform } from 'class-transformer';

export class CreateSponsorDto {
  @IsEnum(SponsorType)
  type: SponsorType;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  eventId: number;

  @IsOptional()
  @IsString()
  isFeatured: string;
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

  @IsOptional()
  @IsString()
  isFeatured: string;
}
