// src/app/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/users.entity';
import { FirebaseService } from './firebase.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private firebaseService: FirebaseService,
  ) {}

  // 🔔 Send notification to user
  async sendToUser(userId: number, title: string, body: string, data?: any) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Save notification in DB
    const notification = await this.notificationRepo.save({
      title,
      body,
      user,
    });

    // Send via Firebase
    if (user.fcm) {
      try {
        await this.firebaseService.sendToToken(user.fcm, title, body, data);
      } catch (err) {
        // 🔇 Silent failure (log only)
        console.error('FCM send failed:', err.message || err);
      }
    }

    return {
      notification: {
        ...notification,
        user: { id: notification.user.id, name: notification.user.name },
      },
    };
  }

  // 📥 Get user notifications
  async getUserNotifications(userId: number, page = 1, size = 10) {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / size),
    };
  }

  // 👁 Mark one notification as seen
  async markOneSeen(userId: number, notificationId: number) {
    const notification = await this.notificationRepo.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.seen = true;
    return this.notificationRepo.save(notification);
  }

  // 👁👁 Mark all notifications as seen
  async markAllSeen(userId: number) {
    await this.notificationRepo.update(
      { user: { id: userId }, seen: false },
      { seen: true },
    );

    return { success: true };
  }
}
