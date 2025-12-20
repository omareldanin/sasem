// sponsors/sponsors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor, SponsorType } from './sponsor.entity';
import { Event } from '../event/event.entity';
import { CreateSponsorDto, UpdateSponsorDto } from './sponsor.dto';

@Injectable()
export class SponsorsService {
  constructor(
    @InjectRepository(Sponsor)
    private sponsorRepo: Repository<Sponsor>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async create(dto: CreateSponsorDto) {
    const event = await this.eventRepo.findOne({
      where: { id: dto.eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const sponsor = this.sponsorRepo.create({
      type: dto.type,
      image: dto.image,
      isFeatured: dto.isFeatured === 'true' ? true : false,
      event,
    });

    return this.sponsorRepo.save(sponsor);
  }

  // sponsors.service.ts
  async findAll(filters: {
    page?: number;
    size?: number;
    type?: SponsorType;
    eventId?: number;
  }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    const query = this.sponsorRepo
      .createQueryBuilder('sponsor')
      .leftJoinAndSelect('sponsor.event', 'event')
      .orderBy('sponsor.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    // ---------- FILTERS ----------
    if (filters.type) {
      query.andWhere('sponsor.type = :type', {
        type: filters.type,
      });
    }

    if (filters.eventId) {
      query.andWhere('event.id = :eventId', {
        eventId: filters.eventId,
      });
    }

    // ---------- COUNT ----------
    const total = await query.getCount();

    // ---------- DATA ----------
    const data = await query.getMany();

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(id: number, dto: UpdateSponsorDto) {
    const sponsor = await this.sponsorRepo.findOne({ where: { id } });

    if (!sponsor) throw new NotFoundException('Sponsor not found');

    Object.assign(sponsor, {
      ...dto,
      isFeatured:
        dto.isFeatured === 'true'
          ? true
          : dto.isFeatured === 'false'
            ? false
            : sponsor.isFeatured,
    });
    return this.sponsorRepo.save(sponsor);
  }

  async remove(id: number) {
    const sponsor = await this.sponsorRepo.findOne({ where: { id } });

    if (!sponsor) throw new NotFoundException('Sponsor not found');

    await this.sponsorRepo.remove(sponsor);
    return { success: true };
  }

  async findOne(id: number) {
    const sponsor = await this.sponsorRepo.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!sponsor) throw new NotFoundException('Sponsor not found');
    return sponsor;
  }

  // ✅ Get all sponsors for event
  async getEventSponsors(eventId: number) {
    return this.sponsorRepo.find({
      where: { event: { id: eventId } },
      order: { type: 'ASC' },
    });
  }

  async getEventSponsorsGrouped(eventId: number) {
    const sponsors = await this.getEventSponsors(eventId);

    return {
      platinum: sponsors.filter((s) => s.type === 'PLATINUM'),
      exhibitor: sponsors.filter((s) => s.type === 'EXHIBITOR'),
      other: sponsors.filter((s) => s.type === 'OTHER'),
    };
  }
}
