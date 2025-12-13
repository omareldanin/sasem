// src/app/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { FirebaseService } from './firebase.service';
import { User } from '../users/users.entity';
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [NotificationsService, FirebaseService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
