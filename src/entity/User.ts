import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentType } from './AppointmentType';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birth_day: string;

  @Column()
  phone_number: string;

  @ManyToOne(() => AppointmentType)
  @JoinColumn()
  type: AppointmentType['id'];

  @Column()
  reservation_date: string;

  @Column()
  reservation_time: string;

  @Column({
    nullable: true,
  })
  memo?: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @Column()
  reservation_id: string;
}
