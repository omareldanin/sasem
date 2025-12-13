import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import {
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserFiltersDto,
} from './user.dto';
import { env } from '../../config';
import { Member } from '../member/member.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) {}

  // 👉 Create new user
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      dto.password + env.PASSWORD_SALT,
      12,
    );
    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepo.save(user);
  }

  // 👉 Get all with filters
  async getAll(filters: UserFiltersDto) {
    const where: any = {};

    if (filters.name) where.name = Like(`%${filters.name}%`);
    if (filters.email) where.email = Like(`%${filters.email}%`);
    if (filters.phone) where.phone = Like(`%${filters.phone}%`);
    if (filters.role) where.role = filters.role;

    return this.usersRepo.find({ where });
  }

  // 👉 Get one user by id
  async getOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // 👉 Update user
  async updateOne(id: number, dto: UpdateUserDto) {
    const user = await this.getOne(id);

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({
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

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['member'],
    });

    if (!user) throw new NotFoundException('User not found');

    // -------- UPDATE USER --------
    if (dto.name) user.name = dto.name;
    if (dto.phone) user.phone = dto.phone;
    if (dto.avatar) user.avatar = dto.avatar;

    await this.usersRepo.save(user);

    // -------- UPDATE MEMBER (if exists) --------
    if (user.member) {
      Object.assign(user.member, {
        scfhs: dto.membershipNumber,
        facebook: dto.facebook,
        x: dto.x,
      });

      await this.memberRepo.save(user.member);
    }

    const { password, refreshTokens, ...safeUser } = user;
    return safeUser;
  }

  // 👉 Delete user
  async deleteOne(id: number) {
    const user = await this.getOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.usersRepo.remove(user);
  }
}
