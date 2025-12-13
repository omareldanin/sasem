// src/app/notifications/dto/send-notification.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  body: string;
}
