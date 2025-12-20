// sponsor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Event } from '../event/event.entity';

export enum SponsorType {
  PLATINUM = 'PLATINUM',
  EXHIBITOR = 'EXHIBITOR',
  OTHER = 'OTHER',
}

@Entity()
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'enum',
    enum: SponsorType,
  })
  type: SponsorType;

  @Column()
  image: string;

  @Column({ default: false })
  isFeatured: Boolean;
  // -------- Relation --------
  @ManyToOne(() => Event, (event) => event.sponsors, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
