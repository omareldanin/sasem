import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../users/users.entity';
import { Gender } from './member.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMemberDto {
  // USER FIELDS
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  // MEMBER FIELDS
  @IsString()
  title: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  specialty: string;

  @IsString()
  jopTitle: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  membershipNumber?: string;

  @IsOptional()
  facebook?: string;

  @IsOptional()
  x?: string;
}

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
