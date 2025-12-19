// contact/contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { Event } from '../event/event.entity';
import { CreateContactDto, UpdateContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,

    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateContactDto) {
    const event = await this.eventRepo.findOne({
      where: { id: dto.eventId },
      relations: ['contact'],
    });

    if (!event) throw new NotFoundException('Event not found');

    // Ensure only ONE contact per event
    if (event.contact) {
      throw new Error('Event already has contact info');
    }

    const contact = this.contactRepo.create({
      emails: dto.emails,
      phones: dto.phones,
      address: dto.address,
      event,
    });

    return this.contactRepo.save(contact);
  }

  // contact/contact.service.ts
  async findAll(filters: { page?: number; size?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    const query = this.contactRepo
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.event', 'event')
      .orderBy('contact.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

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

  // ---------- GET BY EVENT ----------
  async findByEvent(eventId: number) {
    const contact = await this.contactRepo.findOne({
      where: { event: { id: eventId } },
    });

    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  // ---------- UPDATE ----------
  async update(id: number, dto: UpdateContactDto) {
    const contact = await this.contactRepo.findOne({
      where: { id },
    });

    if (!contact) throw new NotFoundException('Contact not found');

    Object.assign(contact, dto);
    return this.contactRepo.save(contact);
  }

  // ---------- DELETE ----------
  async remove(id: number) {
    const contact = await this.contactRepo.findOne({
      where: { id },
    });

    if (!contact) throw new NotFoundException('Contact not found');

    await this.contactRepo.remove(contact);
    return { success: true };
  }
}
