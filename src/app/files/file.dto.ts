// files/dto/create-file.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileType } from './file.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  file: string;

  @IsEnum(FileType)
  type: FileType;

  @IsNumber()
  eventId: number;
}

export class UpdateFileDto extends PartialType(CreateFileDto) {}
