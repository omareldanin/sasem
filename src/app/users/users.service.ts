import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Admin } from '../admin/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  // 👉 Create new user
  async create(dto: CreateUserDto) {
    // Check email exists
    const existing = await this.usersRepo.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(
      dto.password + env.PASSWORD_SALT,
      12,
    );
    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
    });

    await this.usersRepo.save(user);

    if (dto.role === 'admin' || dto.role === 'editor') {
      const admin = this.adminRepo.create({
        id: user.id,
        user,
        ...dto,
      });
      await this.adminRepo.save(admin);
    }
    // Remove sensitive data
    const { password, refreshTokens, ...safeUser } = user;
    return safeUser;
  }

  // 👉 Get all with filters
  async getAll(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    const query = this.usersRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phone',
        'user.avatar',
        'user.role',
        'user.createdAt',
      ])
      .orderBy('user.id', 'DESC')
      .skip(skip)
      .take(limit);

    // ----------- FILTERS -----------
    if (filters.name)
      query.andWhere('user.name LIKE :name', { name: `%${filters.name}%` });
    if (filters.email)
      query.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
    if (filters.phone)
      query.andWhere('user.phone LIKE :phone', { phone: `%${filters.phone}%` });
    if (filters.role)
      query.andWhere('user.role = :role', { role: filters.role });

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getOne(id: number) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phone',
        'user.avatar',
        'user.role',
        'user.createdAt',
      ]) // ❌ password excluded
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // 👉 Update user
  async updateOne(id: number, dto: UpdateUserDto) {
    const user = await this.getOne(id);

    if (!user) throw new NotFoundException('User not found');

    // ---------- CHECK EMAIL ----------
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.usersRepo.findOne({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    // ---------- CHECK PHONE ----------
    if (dto.phone && dto.phone !== user.phone) {
      const phoneExists = await this.usersRepo.findOne({
        where: { phone: dto.phone },
      });

      if (phoneExists) {
        throw new BadRequestException('Phone already in use');
      }
    }

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.phone) user.phone = dto.phone;
    if (dto.role) user.role = dto.role;
    if (dto.password)
      user.password = await bcrypt.hash(dto.password + env.PASSWORD_SALT, 12);

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

    // ---------- CHECK EMAIL ----------
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.usersRepo.findOne({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    // ---------- CHECK PHONE ----------
    if (dto.phone && dto.phone !== user.phone) {
      const phoneExists = await this.usersRepo.findOne({
        where: { phone: dto.phone },
      });

      if (phoneExists) {
        throw new BadRequestException('Phone already in use');
      }
    }

    // -------- UPDATE USER --------
    if (dto.name) user.name = dto.name;
    if (dto.phone) user.phone = dto.phone;
    if (dto.email) user.email = dto.email;
    if (dto.avatar) user.avatar = dto.avatar;

    await this.usersRepo.save(user);

    // -------- UPDATE MEMBER (if exists) --------
    if (user.member) {
      Object.assign(user.member, dto);
      await this.memberRepo.save(user.member);
    }

    const { password, refreshTokens, ...safeUser } = user;
    return safeUser;
  }

  // 👉 Delete user
  async deleteOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepo.remove(user);
    return { success: true, message: 'deleted successfuly' };
  }
}
