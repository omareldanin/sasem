// files/file.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Event } from '../event/event.entity';

export enum FileType {
  CONGRESS_BAG = 'CONGRESS_BAG',
  FLOOR_PLAN = 'FLOOR_PLAN',
}

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  title: string;

  @Column()
  file: string;

  @Index()
  @Column({
    type: 'enum',
    enum: FileType,
  })
  type: FileType;

  // ✅ Relation
  @ManyToOne(() => Event, (event) => event.files, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;
}
