import { IsEnum, IsString, MinLength } from 'class-validator';

export enum OtpChannel {
  EMAIL = 'email',
  SMS = 'sms',
}

export class RequestOtpDto {
  @IsString()
  emailOrPhone: string;

  @IsEnum(OtpChannel)
  channel: OtpChannel;
}

export class VerifyOtpDto {
  @IsString()
  emailOrPhone: string;

  @IsString()
  otp: string;
}

export class ChangePasswordWithOtpDto {
  @IsString()
  emailOrPhone: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
