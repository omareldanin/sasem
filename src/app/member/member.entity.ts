import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Member {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ nullable: true })
  jopTitle: string;

  // Social media links
  @Column({ nullable: true })
  membershipNumber: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  x: string; // twitter

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;
}
