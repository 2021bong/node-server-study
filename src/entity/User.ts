import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './Reservation';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  record: Reservation;

  @Column()
  name: string;

  @Column()
  birth_day: string;

  @Column()
  phone_number: string;

  @Column()
  block: boolean;
}
