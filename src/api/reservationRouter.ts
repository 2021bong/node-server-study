import { Router, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Reservation } from '../entity/Reservation';
import { User } from '../entity/User';

import getReservationId from '../utils/getReservationId';
import getStringType from '../utils/getStringType';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const reservationRepository = AppDataSource.getRepository(Reservation);

    if (!req.query.type) {
      res.status(400).send({ message: 'There is no required values.' });
      return;
    }

    if (Number(req.query.type) === 1) {
      const name = req.query.name as string;
      const phone_number = req.query.phone as string;
      if (!name || !phone_number) {
        res.status(400).send({ message: 'There is no required values.' });
        return;
      }

      const reservationDatasOfUser = await userRepository
        .createQueryBuilder('user')
        .leftJoin('user.record', 'reservation')
        .select(['user', 'reservation'])
        .where('user.name = :name', { name })
        .andWhere('user.phone_number = :phone_number', { phone_number })
        .getMany();
      const onlyReservationDatas = reservationDatasOfUser.map(
        (userReservation) => userReservation.record
      );
      const resultDatas = onlyReservationDatas.flat().map((reservation) => {
        return {
          name: reservationDatasOfUser[0].name,
          birth_day: reservationDatasOfUser[0].birth_day,
          phone_number: reservationDatasOfUser[0].phone_number,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          memo: reservation.memo,
          reservation_id: reservation.reservation_id,
        };
      });
      if (resultDatas.length) {
        res.status(200).send(resultDatas);
      } else {
        res.status(204).send([]);
      }
    } else {
      const reservation_id = req.query.reservation_id as string;
      if (!reservation_id) {
        res.status(400).send({ message: 'There is no required values.' });
        return;
      }
      const reservationData = await reservationRepository
        .createQueryBuilder('reservation')
        .leftJoin('reservation.user', 'user')
        .select(['reservation', 'user'])
        .where('reservation_id = :reservation_id', { reservation_id })
        .getOne();

      if (reservationData) {
        const name = reservationData.user.name;
        const birth_day = reservationData.user.birth_day;
        const phone_number = reservationData.user.phone_number;
        const resultData = {
          name,
          birth_day,
          phone_number,
          reservation_date: reservationData.reservation_date,
          reservation_time: reservationData.reservation_time,
          memo: reservationData.memo,
          reservation_id: reservationData.reservation_id,
        };
        res.status(200).send(resultData);
      } else {
        res.status(204).send([]);
      }
    }
    console.log('GET /reservations : status 200');
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('GET /reservations : status 500');
    console.log(err);
  }
});

interface PostReservationRequest extends Request {
  name: string;
  birthDay: string;
  phoneNumber: string;
  type: string;
  reservationDate: string;
  reservationTime: string;
  memo?: string;
}

interface PostReservationResponse extends Response {
  name: string;
  phoneNumber: string;
  reservationType: string;
  reservationId: string;
}

router.post(
  '/',
  async (req: PostReservationRequest, res: PostReservationResponse) => {
    const {
      name,
      birthDay,
      phoneNumber,
      type,
      reservationDate,
      reservationTime,
      memo,
    } = req.body;
    const reservationData = await AppDataSource.getRepository(Reservation).find(
      {
        where: {
          reservation_date: reservationDate,
          reservation_time: reservationTime,
        },
      }
    );
    if (reservationData.length) {
      res.status(409).send({ message: 'The time is already scheduled.' });
      console.log('POST /reservations : status 409');
      return;
    }

    const userData = await AppDataSource.getRepository(User).find({
      where: {
        name,
        birth_day: birthDay,
        phone_number: phoneNumber.replaceAll('-', ''),
      },
    });
    if (userData.length && userData[0].block) {
      res.status(401).send({ message: 'This User cannot make a reservation.' });
      console.log('POST /reservations : status 409');
      return;
    }

    try {
      const newReservation = new Reservation();
      if (userData.length) {
        const userId = userData[0];
        newReservation.user = userId;
        switch (type) {
          case '건강검진':
            newReservation.type = 2;
            break;
          case '정밀검사':
            newReservation.type = 3;
            break;
          case '기타':
            newReservation.type = 4;
            break;
          case '일반진료':
          default:
            newReservation.type = 1;
        }
        newReservation.reservation_date = reservationDate;
        newReservation.reservation_time = reservationTime;
        newReservation.reservation_id = getReservationId(
          userData[0]?.birth_day,
          userData[0]?.phone_number,
          reservationDate,
          reservationTime
        );
        newReservation.memo = memo || null;
        newReservation.created_at = new Date();
        const savedNewReservation = await AppDataSource.getRepository(
          Reservation
        ).save(newReservation);
        const postReservationResponse = {
          name: userData[0].name,
          reservationId: savedNewReservation.reservation_id,
          phoneNumber: userData[0].phone_number,
          reservationType: getStringType(savedNewReservation.type),
        };
        res.status(200).send(postReservationResponse);
      } else {
        const newUser = new User();
        newUser.name = name;
        newUser.birth_day = birthDay;
        newUser.phone_number = phoneNumber.replaceAll('-', '');
        newUser.block = false;
        const savedNewUser = await AppDataSource.getRepository(User).save(
          newUser
        );
        const userId = savedNewUser;
        newReservation.user = userId;
        switch (type) {
          case '건강검진':
            newReservation.type = 2;
            break;
          case '정밀검사':
            newReservation.type = 3;
            break;
          case '기타':
            newReservation.type = 4;
            break;
          case '일반진료':
          default:
            newReservation.type = 1;
        }
        newReservation.reservation_date = reservationDate;
        newReservation.reservation_time = reservationTime;
        newReservation.reservation_id = getReservationId(
          savedNewUser.birth_day,
          savedNewUser.phone_number,
          reservationDate,
          reservationTime
        );
        newReservation.memo = memo || null;
        newReservation.created_at = new Date();
        const savedNewReservation = await AppDataSource.getRepository(
          Reservation
        ).save(newReservation);
        const postReservationResponse = {
          name: savedNewUser.name,
          reservationId: savedNewReservation.reservation_id,
          phoneNumber: savedNewUser.phone_number,
          reservationType: getStringType(savedNewReservation.type),
        };
        res.status(200).send(postReservationResponse);
      }
      console.log('POST /reservations : status 200');
    } catch (err) {
      res.status(500).send({ message: err });
      console.log('POST /reservations status : 500');
      console.log(err);
    }
  }
);

export default router;
