import {
  IsEnum,
  IsDateString,
  IsObject,
  IsOptional,
  IsInt,
  IsArray,
  IsString,
} from 'class-validator';
import { EventType } from './event.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateEventDto {
  @IsString()
  arName: string;

  @IsString()
  enName: string;

  @IsString()
  arDescription: string;

  @IsString()
  enDescription: string;

  @IsDateString()
  fromDate: Date;

  @IsDateString()
  toDate: Date;

  @IsOptional()
  @IsString()
  cover: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];
}
export class UpdateEventDto extends PartialType(CreateEventDto) {}
