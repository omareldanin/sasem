// files/files.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity, FileType } from './file.entity';
import { CreateFileDto, UpdateFileDto } from './file.dto';
import { Event } from '../event/event.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,

    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateFileDto) {
    const event = await this.eventRepo.findOne({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const file = this.fileRepo.create({
      title: dto.title,
      file: dto.file,
      type: dto.type,
      event,
    });

    return this.fileRepo.save(file);
  }

  // ---------- GET ALL (PAGINATED + FILTERS) ----------
  async findAll(filters: {
    page?: number;
    size?: number;
    type?: FileType;
    eventId?: number;
  }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;

    const query = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.event', 'event')
      .orderBy('file.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (filters.type) {
      query.andWhere('file.type = :type', {
        type: filters.type,
      });
    }

    if (filters.eventId) {
      query.andWhere('event.id = :eventId', {
        eventId: filters.eventId,
      });
    }

    const total = await query.getCount();
    const data = await query.getMany();

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  // ---------- UPDATE ----------
  async update(id: number, dto: UpdateFileDto) {
    const file = await this.fileRepo.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    Object.assign(file, dto);
    return this.fileRepo.save(file);
  }

  // ---------- DELETE ----------
  async remove(id: number) {
    const file = await this.fileRepo.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.fileRepo.remove(file);
    return { success: true };
  }
}
