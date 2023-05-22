import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentType } from './AppointmentType';
import { User } from './User';

interface UserInterface {
  id: number;
  name: string;
  birth_day: string;
  phone_number: string;
  block: boolean;
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.record)
  @JoinColumn(User['id'])
  user: UserInterface;

  @ManyToOne(() => AppointmentType)
  @JoinColumn(AppointmentType['id'])
  type: number;

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
