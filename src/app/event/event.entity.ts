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
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';

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

  // -------- Type --------
  @Index()
  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

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

  // -------- Timestamp --------
  @CreateDateColumn()
  createdAt: Date;
}
