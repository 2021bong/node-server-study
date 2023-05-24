import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './Reservation';

@Entity()
export class AppointmentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => Reservation, (reservation) => reservation.type)
  record: Reservation;
}
