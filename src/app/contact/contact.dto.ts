import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsString, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateContactDto {
  @IsArray()
  @ArrayNotEmpty()
  emails: string[];

  @IsArray()
  @ArrayNotEmpty()
  phones: string[];

  @IsString()
  address: string;

  @IsNumber()
  eventId: number;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {}
