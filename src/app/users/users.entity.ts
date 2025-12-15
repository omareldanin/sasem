import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Member } from '../member/member.entity';
import { Admin } from '../admin/admin.entity';
import { Event } from '../event/event.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  EDITOR = 'editor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'json', nullable: true })
  refreshTokens: string[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  fcm: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  // 🔥 Auto-managed timestamps
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.user, { nullable: true })
  member?: Member;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin?: Admin;

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents: Event[];

  @ManyToMany(() => Event, (event) => event.users)
  events: Event[];
}
