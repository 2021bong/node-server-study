import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';

type AppointmentTypeTuple = '일반진료' | '정기검진' | '정밀검사' | '기타';

@Entity()
export class AppointmentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: AppointmentTypeTuple;

  @OneToMany(() => User, (user) => user.type)
  user: User;
}
