// blog/blog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { Event } from '../event/event.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,

    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateBlogDto) {
    const event = await this.eventRepo.findOne({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const blog = this.blogRepo.create({
      ...dto,
      date: new Date(dto.date),
      event,
    });
    return this.blogRepo.save(blog);
  }

  // ---------- GET ALL (PAGINATED) ----------
  async findAll(filters: {
    page?: number;
    size?: number;
    eventId?: number;
    lang?: 'ar' | 'en';
  }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.size) || 10;
    const skip = (page - 1) * limit;
    const lang =
      filters.lang === 'ar' || filters.lang === 'en' ? filters.lang : null;

    const query = this.blogRepo
      .createQueryBuilder('blog')
      .leftJoin('blog.event', 'event')
      .orderBy('blog.date', 'DESC')
      .skip(skip)
      .take(limit);

    // ---------- FILTER BY EVENT ----------
    if (filters.eventId) {
      query.andWhere('event.id = :eventId', {
        eventId: filters.eventId,
      });
    }

    // ---------- SELECT ----------
    query.select(['blog.id', 'blog.date', 'blog.createdAt']);

    if (lang) {
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.name, '$.${lang}'))`,
        'name',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.title, '$.${lang}'))`,
        'title',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.address, '$.${lang}'))`,
        'address',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.content, '$.${lang}'))`,
        'content',
      );
    } else {
      query.addSelect([
        'blog.name',
        'blog.title',
        'blog.address',
        'blog.content',
      ]);
    }

    // ---------- COUNT ----------
    const total = await query.clone().getCount();

    // ---------- DATA ----------
    const rows = await query.getRawMany();

    const data = rows.map((row) => ({
      id: row.blog_id,
      date: row.blog_date,
      createdAt: row.blog_createdAt,
      name: lang ? row.name : row.blog_name,
      title: lang ? row.title : row.blog_title,
      address: lang ? row.address : row.blog_address,
      content: lang ? row.content : row.blog_content,
    }));

    return {
      data,
      total,
      page,
      size: limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  // ---------- GET ONE ----------
  async findOne(id: number, lang?: 'ar' | 'en') {
    const hasLang = lang === 'ar' || lang === 'en';

    const query = this.blogRepo
      .createQueryBuilder('blog')
      .leftJoin('blog.event', 'event')
      .where('blog.id = :id', { id });

    // ---------- SELECT ----------
    query.select([
      'blog.id',
      'blog.date',
      'blog.createdAt',
      'event.id AS eventId',
    ]);

    if (hasLang) {
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.name, '$.${lang}'))`,
        'name',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.title, '$.${lang}'))`,
        'title',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.address, '$.${lang}'))`,
        'address',
      );
      query.addSelect(
        `JSON_UNQUOTE(JSON_EXTRACT(blog.content, '$.${lang}'))`,
        'content',
      );
    } else {
      query.addSelect([
        'blog.name',
        'blog.title',
        'blog.address',
        'blog.content',
      ]);
    }

    const row = await query.getRawOne();

    if (!row) {
      throw new NotFoundException('Blog not found');
    }

    return {
      id: row.blog_id,
      date: row.blog_date,
      createdAt: row.blog_createdAt,
      eventId: row.eventId,
      name: hasLang ? row.name : row.blog_name,
      title: hasLang ? row.title : row.blog_title,
      address: hasLang ? row.address : row.blog_address,
      content: hasLang ? row.content : row.blog_content,
    };
  }

  // ---------- UPDATE ----------
  async update(id: number, dto: UpdateBlogDto) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    Object.assign(blog, dto);
    return this.blogRepo.save(blog);
  }

  // ---------- DELETE ----------
  async remove(id: number) {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    await this.blogRepo.remove(blog);
    return { success: true };
  }
}
