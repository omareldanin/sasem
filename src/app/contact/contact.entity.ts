// contact/contact.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Event } from '../event/event.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  // -------- Emails --------
  @Column({ type: 'json' })
  emails: string[];

  // -------- Phones --------
  @Column({ type: 'json' })
  phones: string[];

  // -------- Address --------
  @Column()
  address: string;

  // -------- Relation --------
  @OneToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() // owning side
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
