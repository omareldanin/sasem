import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { PasswordResetToken } from './password-reset.entity';
import { CommunicationLog } from '../logs/communication-log.entity';
import { MailService } from '../../lib/mail.service';
import { SmsService } from '../../lib/sms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PasswordResetToken,
      CommunicationLog, // 👈 REQUIRED
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, MailService, SmsService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
