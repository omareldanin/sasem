export enum EventType {
  KEYNOTE = 'KEYNOTE',
  SESSION = 'SESSION',
  WORKSHOP = 'WORKSHOP',
  PANEL = 'PANEL',
  TALK = 'TALK',
  SEMINAR = 'SEMINAR',
  TUTORIAL = 'TUTORIAL',
  BREAKOUT = 'BREAKOUT',
  ROUNDTABLE = 'ROUNDTABLE',
  FIRESIDE_CHAT = 'FIRESIDE_CHAT',
  POSTER = 'POSTER',
  LIGHTNING = 'LIGHTNING',
  TRAINING = 'TRAINING',
  DEMO = 'DEMO',
  NETWORKING = 'NETWORKING',
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Sponsor } from '../sponsor/sponsor.entity';
import { FileEntity } from '../files/file.entity';
import { Blog } from '../blogs/blog.entity';
import { Contact } from '../contact/contact.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  // -------- Multilingual fields (JSON) --------
  @Column({
    type: 'json',
  })
  name: {
    ar: string;
    en: string;
  };

  @Column({
    type: 'json',
  })
  description: {
    ar: string;
    en: string;
  };

  // -------- Dates --------
  @Column({ type: 'timestamp' })
  fromDate: Date;

  @Column({ type: 'timestamp' })
  toDate: Date;

  @Column({ nullable: true })
  cover: string;
  // -------- Creator --------
  @ManyToOne(() => User, (user) => user.createdEvents, {
    onDelete: 'CASCADE',
  })
  createdBy: User;

  // -------- Attendees --------
  @ManyToMany(() => User, (user) => user.events)
  @JoinTable({
    name: 'event_users',
    joinColumn: { name: 'eventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];

  // -------- Sponsors --------
  @OneToMany(() => Sponsor, (sponsor) => sponsor.event)
  sponsors: Sponsor[];

  @OneToMany(() => FileEntity, (file) => file.event)
  files: FileEntity[];

  @OneToMany(() => Blog, (blog) => blog.event)
  blogs: Blog[];

  @OneToOne(() => Contact, (contact) => contact.event)
  contact: Contact;
  // -------- Timestamp --------
  @CreateDateColumn()
  createdAt: Date;
}
