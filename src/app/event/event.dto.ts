import {
  IsEnum,
  IsDateString,
  IsObject,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';
import { EventType } from './event.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateEventDto {
  @IsObject()
  name: { ar: string; en: string };

  @IsObject()
  description: { ar: string; en: string };

  @IsDateString()
  fromDate: Date;

  @IsDateString()
  toDate: Date;

  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];
}
export class UpdateEventDto extends PartialType(CreateEventDto) {}
