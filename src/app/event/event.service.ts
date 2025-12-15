import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from './event.entity';
import { User } from '../users/users.entity';
import { CreateEventDto, UpdateEventDto } from './event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 📆 Date validation helper
  private validateDates(from: Date, to: Date) {
    if (new Date(from) >= new Date(to)) {
      throw new BadRequestException('fromDate must be before toDate');
    }
  }

  // ➕ CREATE
  async create(dto: CreateEventDto, creator: User) {
    this.validateDates(dto.fromDate, dto.toDate);

    let users: User[] = [];

    if (dto.userIds?.length) {
      users = await this.userRepo.findBy({
        id: In(dto.userIds),
      });

      if (users.length !== dto.userIds.length) {
        throw new BadRequestException('One or more users not found');
      }
    }

    const event = this.eventRepo.create({
      name: {
        ar: dto.arName,
        en: dto.enName,
      },
      description: {
        ar: dto.arDescription,
        en: dto.enDescription,
      },
      cover: dto.cover,
      fromDate: new Date(dto.fromDate),
      toDate: new Date(dto.toDate),
      createdBy: creator,
      users,
    });

    const savedEvent = await this.eventRepo.save(event);

    // remove sensitive fields
    const sanitizeUser = (user: any) => {
      if (!user) return user;
      delete user.password;
      delete user.refreshTokens;
      return user;
    };

    savedEvent.createdBy = sanitizeUser(savedEvent.createdBy);
    savedEvent.users = savedEvent.users?.map(sanitizeUser);

    return savedEvent;
  }

  // 📄 GET ALL (pagination + search by language)
  async findAll(filters: any, user: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    const hasLang = filters.lang === 'ar' || filters.lang === 'en';
    const lang = hasLang ? filters.lang : null;

    const baseQuery = this.eventRepo
      .createQueryBuilder('event')
      .leftJoin('event.createdBy', 'user')
      .orderBy('event.createdAt', 'DESC');

    if (user.role === 'member') {
      baseQuery
        .innerJoin('event.users', 'eventUser')
        .andWhere('eventUser.id = :userId', { userId: user.id });
    }

    // ---------- SELECT ----------
    baseQuery.select([
      'event.id',
      'event.fromDate',
      'event.toDate',
      'event.cover',
      'event.createdAt',
      'user.id',
      'user.name',
    ]);

    if (hasLang) {
      baseQuery.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(event.name, '$.${lang}'))`,
        'event_name_lang',
      );
      baseQuery.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(event.description, '$.${lang}'))`,
        'event_description_lang',
      );
    } else {
      baseQuery.addSelect('event.name', 'event_name');
      baseQuery.addSelect('event.description', 'event_description');
    }

    // ---------- SEARCH ----------
    if (filters.search) {
      if (hasLang) {
        baseQuery.andWhere(
          `JSON_UNQUOTE(JSON_EXTRACT(event.name, '$.${lang}')) LIKE :search`,
          { search: `%${filters.search}%` },
        );
      } else {
        baseQuery.andWhere(
          `(JSON_UNQUOTE(JSON_EXTRACT(event.name, '$.en')) LIKE :search
          OR JSON_UNQUOTE(JSON_EXTRACT(event.name, '$.ar')) LIKE :search)`,
          { search: `%${filters.search}%` },
        );
      }
    }

    if (filters.type) {
      baseQuery.andWhere('event.type = :type', { type: filters.type });
    }

    // ---------- COUNT (clone query) ----------
    const total = await baseQuery.clone().getCount();

    // ---------- DATA ----------
    const rows = await baseQuery.skip(skip).take(limit).getRawMany();

    const data = rows.map((row) => ({
      id: row.event_id,
      name: hasLang ? row.event_name_lang : row.event_name,
      description: hasLang ? row.event_description_lang : row.event_description,
      fromDate: row.event_fromDate,
      toDate: row.event_toDate,
      cover: row.event_cover,
      createdAt: row.event_createdAt,
      createdBy: {
        id: row.user_id,
        name: row.user_name,
      },
    }));

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getOne(id: number, filters: any = {}) {
    const hasLang = filters.lang === 'ar' || filters.lang === 'en';
    const lang = hasLang ? filters.lang : null;

    const query = this.eventRepo
      .createQueryBuilder('event')
      .leftJoin('event.createdBy', 'user')
      .where('event.id = :id', { id });

    // ---------- SELECT ----------
    query.select([
      'event.id',
      'event.fromDate',
      'event.toDate',
      'event.cover',
      'event.createdAt',
      'user.id',
      'user.name',
    ]);

    if (hasLang) {
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(event.name, '$.${lang}'))`,
        'event_name_lang',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(event.description, '$.${lang}'))`,
        'event_description_lang',
      );
    } else {
      query.addSelect('event.name', 'event_name');
      query.addSelect('event.description', 'event_description');
    }

    // ---------- EXECUTE ----------
    const row = await query.getRawOne();

    if (!row) {
      throw new NotFoundException('Event not found');
    }

    return {
      id: row.event_id,
      name: hasLang ? row.event_name_lang : row.event_name,
      description: hasLang ? row.event_description_lang : row.event_description,
      fromDate: row.event_fromDate,
      toDate: row.event_toDate,
      cover: row.event_cover,
      createdAt: row.event_createdAt,
      createdBy: {
        id: row.user_id,
        name: row.user_name,
      },
    };
  }

  async getEventUsers(eventId: number, filters: any) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    // Ensure event exists
    const exists = await this.eventRepo.findOne({
      where: { id: eventId },
      select: ['id'],
    });

    if (!exists) {
      throw new NotFoundException('Event not found');
    }

    const baseQuery = this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.events', 'event', 'event.id = :eventId', { eventId })
      .leftJoin('user.member', 'member');

    // ---------- SELECT ----------
    baseQuery.select([
      'user.id',
      'user.name',
      'user.email',
      'user.phone',

      'member.id',
      'member.title',
      'member.gender',
      'member.country',
      'member.city',
      'member.specialty',
      'member.jopTitle',
    ]);

    // ---------- COUNT ----------
    const total = await baseQuery.clone().getCount();

    // ---------- DATA ----------
    const rows = await baseQuery.skip(skip).take(limit).getRawMany();

    const data = rows.map((row) => ({
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
      phone: row.user_phone,
      member: row.member_id
        ? {
            id: row.member_id,
            title: row.member_title,
            gender: row.member_gender,
            country: row.member_country,
            city: row.member_city,
            specialty: row.member_specialty,
            jobTitle: row.member_jopTitle,
          }
        : null,
    }));

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  // 📄 GET ONE
  async findOne(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['createdBy', 'users'],
    });

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  // ✏️ UPDATE
  async update(id: number, dto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (dto.fromDate && dto.toDate) {
      this.validateDates(dto.fromDate, dto.toDate);
    }

    if (dto.userIds) {
      const users = await this.userRepo.findBy({
        id: In(dto.userIds),
      });

      if (users.length !== dto.userIds.length) {
        throw new BadRequestException('One or more users not found');
      }

      event.users = users;
    }

    Object.assign(event, {
      name: {
        ar: dto.arName,
        en: dto.enName,
      },
      description: {
        ar: dto.arDescription,
        en: dto.enDescription,
      },
      cover: dto.cover ? dto.cover : undefined,
      fromDate: dto.fromDate ? new Date(dto.fromDate) : undefined,
      toDate: dto.toDate ? new Date(dto.toDate) : undefined,
    });
    const savedEvent = await this.eventRepo.save(event);

    // remove sensitive fields
    const sanitizeUser = (user: any) => {
      if (!user) return user;
      delete user.password;
      delete user.refreshTokens;
      return user;
    };

    savedEvent.createdBy = sanitizeUser(savedEvent.createdBy);
    savedEvent.users = savedEvent.users?.map(sanitizeUser);

    return savedEvent;
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.eventRepo.remove(event);
    return { message: 'Event deleted' };
  }

  // 🎟️ REGISTER USER
  async register(eventId: number, user: User) {
    const event = await this.findOne(eventId);

    if (event.users.some((u) => u.id === user.id)) {
      throw new BadRequestException('Already registered');
    }

    event.users.push(user);
    return this.eventRepo.save(event);
  }

  // 🚪 UNREGISTER USER
  async unregister(eventId: number, user: User) {
    const event = await this.findOne(eventId);

    event.users = event.users.filter((u) => u.id !== user.id);
    return this.eventRepo.save(event);
  }
}
