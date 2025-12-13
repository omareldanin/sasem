import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Member } from './member.entity';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/users.entity';
import { CreateMemberDto, UpdateMemberDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateMemberDto) {
    // Check email exists
    const existing = await this.userRepo.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) throw new BadRequestException('User already exists');

    // Create user
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: await bcrypt.hash(dto.password, 10),
      role: dto.role ?? UserRole.MEMBER,
    });
    await this.userRepo.save(user);

    // Create member linked to user
    const member = this.memberRepo.create({
      title: dto.title,
      profession: dto.profession,
      gender: dto.gender,
      country: dto.country,
      city: dto.city,
      nationality: dto.nationality,
      membershipNumber: dto.membershipNumber,
      facebook: dto.facebook,
      x: dto.x,
      user,
    });

    return this.memberRepo.save(member);
  }

  // ---------------------------------------------------------
  // GET ALL MEMBERS + USER INFO + FILTERS
  // ---------------------------------------------------------
  async getAll(filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    // Build dynamic query
    const query = this.memberRepo
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .orderBy('member.id', 'DESC')
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

    if (filters.gender)
      query.andWhere('member.gender = :gender', { gender: filters.gender });
    if (filters.profession)
      query.andWhere('member.profession LIKE :profession', {
        profession: `%${filters.profession}%`,
      });
    if (filters.country)
      query.andWhere('member.country = :country', { country: filters.country });
    if (filters.city)
      query.andWhere('member.city = :city', { city: filters.city });

    // Execute
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getOne(id: number) {
    const member = await this.memberRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async updateOne(id: number, dto: UpdateMemberDto) {
    const member = await this.getOne(id);
    const user = member.user;

    // Update user data
    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.phone) user.phone = dto.phone;
    if (dto.role) user.role = dto.role;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);

    await this.userRepo.save(user);

    // Update member data
    Object.assign(member, dto);

    return this.memberRepo.save(member);
  }

  async deleteOne(id: number) {
    const member = await this.getOne(id);
    await this.memberRepo.remove(member);
    await this.userRepo.remove(member.user);
    return { success: true };
  }
}
