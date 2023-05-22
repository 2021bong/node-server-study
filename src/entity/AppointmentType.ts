import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './Reservation';

type AppointmentTypeTuple = '일반진료' | '정기검진' | '정밀검사' | '기타';

@Entity()
export class AppointmentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: AppointmentTypeTuple;

  @OneToMany(() => Reservation, (reservation) => reservation.type)
  record: Reservation;
}
