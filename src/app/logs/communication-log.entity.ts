import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum CommunicationType {
  EMAIL = 'email',
  SMS = 'sms',
}

@Entity('communication_logs')
export class CommunicationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: CommunicationType,
  })
  type: CommunicationType;

  @Column()
  destination: string; // email or phone

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: true })
  success: boolean;

  @Column({ nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;
}
