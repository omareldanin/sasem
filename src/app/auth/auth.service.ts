// src/app/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/users.entity';
import { env } from '../../config';
import {
  ChangePasswordWithOtpDto,
  RequestOtpDto,
  VerifyOtpDto,
} from './auth.dto';
import { PasswordResetToken } from './password-reset.entity';
import {
  CommunicationLog,
  CommunicationType,
} from '../logs/communication-log.entity';
import { MailService } from '../../lib/mail.service';
import { SmsService } from '../../lib/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private resetRepo: Repository<PasswordResetToken>,

    @InjectRepository(CommunicationLog)
    private logRepo: Repository<CommunicationLog>,

    private jwtService: JwtService,
    private mailService: MailService,
    private smsService: SmsService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateAccessToken(user: User) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  private async generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
      },
    );
  }

  private async saveRefreshToken(user: User, refreshToken: string) {
    const tokens = user.refreshTokens ?? [];
    tokens.push(refreshToken);
    user.refreshTokens = tokens;
    await this.userRepo.save(user);
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(emailOrPhone: string, password: string, fcm?: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: emailOrPhone,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compareSync(
      password + (env.PASSWORD_SALT as string),
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (fcm) {
      user.fcm = fcm;
      await this.userRepo.save(user);
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.saveRefreshToken(user, refreshToken);

    return {
      status: 'login success',
      accessToken,
      refreshToken,
    };
  }

  // ---------------------------
  // REFRESH TOKEN
  // ---------------------------
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepo.findOne({ where: { id: decoded.id } });
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    // replace old token with new one (optional but recommended)
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await this.userRepo.save(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  // ---------------------------
  // LOGOUT (remove a refresh token)
  // ---------------------------
  async logout(userId: number, refreshToken?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return { success: true };

    if (!user.refreshTokens || user.refreshTokens.length === 0) {
      return { success: true };
    }

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    } else {
      // remove all refresh tokens for this user
      user.refreshTokens = [];
    }

    await this.userRepo.save(user);
    return { success: true };
  }

  // ---------------------------
  // VALIDATE TOKEN (for frontend)
  // ---------------------------
  async validateToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (e) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['member'], // 👈 only if you want member info
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { password, refreshTokens, ...safeUser } = user;
    return safeUser;
  }

  // ---------------------------
  // REQUEST OTP (for frontend)
  // ---------------------------
  async requestOtp(dto: RequestOtpDto) {
    const user = await this.userRepo.findOne({
      where: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
    });

    // prevent user enumeration
    if (!user) return { success: true };

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.resetRepo.save({
      userId: user.id,
      otp,
      expiresAt,
    });

    try {
      if (dto.channel === 'email' && user.email) {
        await this.mailService.sendMail(
          user.email,
          'Password Reset Code',
          `<h3>Your OTP is: ${otp}</h3>`,
        );

        await this.logRepo.save({
          userId: user.id,
          type: CommunicationType.EMAIL,
          destination: user.email,
          subject: 'Password Reset OTP',
          message: otp,
          success: true,
        });
      }

      if (dto.channel === 'sms' && user.phone) {
        await this.smsService.sendSms(
          user.phone,
          `Your IMED reset code is ${otp}`,
        );

        await this.logRepo.save({
          userId: user.id,
          type: CommunicationType.SMS,
          destination: user.phone,
          subject: 'Password Reset OTP',
          message: otp,
          success: true,
        });
      }
    } catch (e) {
      await this.logRepo.save({
        userId: user.id,
        type:
          dto.channel === 'email'
            ? CommunicationType.EMAIL
            : CommunicationType.SMS,
        destination: dto.emailOrPhone,
        subject: 'Password Reset OTP',
        message: otp,
        success: false,
        error: e.message,
      });
    }

    return { success: true };
  }

  // ---------------------------
  // VERIFY OTP (for frontend)
  // ---------------------------
  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepo.findOne({
      where: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
    });

    if (!user) throw new UnauthorizedException('Invalid OTP');

    const token = await this.resetRepo.findOne({
      where: {
        userId: user.id,
        otp: dto.otp,
        used: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    return { verified: true };
  }

  // ---------------------------
  // VERIFY OTP AND CHANGE PASSWORD (for frontend)
  // ---------------------------
  async changePasswordWithOtp(dto: ChangePasswordWithOtpDto) {
    const user = await this.userRepo.findOne({
      where: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
    });

    if (!user) throw new UnauthorizedException();

    const token = await this.resetRepo.findOne({
      where: {
        userId: user.id,
        otp: dto.otp,
        used: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    token.used = true;
    await this.resetRepo.save(token);

    return { success: true };
  }
}
