// blog/blog.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Event } from '../event/event.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  // -------- Name --------
  @Column({ type: 'json' })
  name: {
    ar: string;
    en: string;
  };

  // -------- Title --------
  @Column({ type: 'json', nullable: true })
  title: {
    ar: string;
    en: string;
  };

  // -------- Address --------
  @Column({ type: 'json', nullable: true })
  address: {
    ar: string;
    en: string;
  };

  // -------- Blog Content (HTML) --------
  @Column({ type: 'json' })
  content: {
    ar: string; // HTML
    en: string; // HTML
  };

  // -------- Publish Date --------
  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Event, (event) => event.blogs, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
