// blog/dto/create-blog.dto.ts
import { IsDateString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsObject()
  name: { ar: string; en: string };

  @IsOptional()
  @IsObject()
  title: { ar: string; en: string };

  @IsOptional()
  @IsObject()
  address: { ar: string; en: string };

  @IsObject()
  content: { ar: string; en: string };

  @IsDateString()
  date: string;

  @IsNumber()
  eventId: number;
}

export class UpdateBlogDto {
  @IsOptional()
  @IsObject()
  name?: { ar: string; en: string };

  @IsOptional()
  @IsObject()
  title?: { ar: string; en: string };

  @IsOptional()
  @IsObject()
  address?: { ar: string; en: string };

  @IsOptional()
  @IsObject()
  content?: { ar: string; en: string };

  @IsOptional()
  @IsNumber()
  eventId: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
