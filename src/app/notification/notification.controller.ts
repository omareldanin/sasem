// src/app/notifications/notifications.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';
import { SendNotificationDto } from './send-notification.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('send')
  sendNotification(@Body() dto: SendNotificationDto, @Req() req: Request) {
    return this.service.sendToUser(dto.userId, dto.title, dto.body);
  }

  // GET /notifications
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyNotifications(
    @Req() req,
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    const user = req['user'];
    return this.service.getUserNotifications(
      user.id,
      Number(page),
      Number(size),
    );
  }

  // PATCH /notifications/:id/seen
  @UseGuards(JwtAuthGuard)
  @Patch(':id/seen')
  markOneSeen(@Req() req, @Param('id') id: number) {
    const user = req['user'];
    return this.service.markOneSeen(user.id, Number(id));
  }

  // PATCH /notifications/seen-all
  @UseGuards(JwtAuthGuard)
  @Patch('seen-all')
  markAllSeen(@Req() req) {
    const user = req['user'];
    return this.service.markAllSeen(user.id);
  }
}
