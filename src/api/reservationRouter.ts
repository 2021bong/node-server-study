import { Router, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Reservation } from '../entity/Reservation';
import { User } from '../entity/User';

import getReservationId from '../utils/getReservationId';
import getStringType from '../utils/getStringType';
import getNumberType from '../utils/getNumberType';

const router = Router();

router.get('/check', async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;

    if (!req.query.date) {
      res.status(400).send({ message: 'There is no required values.' });
      return;
    }
    const [year, month, day] = date.split('-');
    if (
      !year ||
      !month ||
      !day ||
      year.length !== 4 ||
      month.length !== 2 ||
      day.length !== 2
    ) {
      res
        .status(400)
        .send({ message: 'This is not a valid format. (not YYYY-MM-DD)' });
      return;
    }
    if (
      Number(year) < new Date().getFullYear() ||
      Number(month) > 12 ||
      Number(day) > 31
    ) {
      res.status(400).send({ message: 'This is not a valid date.' });
      return;
    }

    const reservedTimeData = await AppDataSource.getRepository(
      Reservation
    ).find({
      select: ['reservation_time'],
      where: {
        reservation_date: date,
      },
    });
    const onlyTimeData = reservedTimeData.map((time) => time.reservation_time);
    res.status(200).send({ reservedTime: onlyTimeData });
    console.log('GET /reservations/check : status 200');
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('GET /reservations/check : status 500');
    console.log(err);
  }
});

/**
 * TODO exception situation error handling
 * GET /writing?type=1&name={name}&phone={phone_number}
 * GET /writing?type=2&reservation_id={reservation_id}
 * 1. 쿼리스트링 없이 요청을 보냈을 때
 * 2. 쿼리스트링 type에 따른 필요한 키 값이 없을 때
 */

router.get('/writing', async (req: Request, res: Response) => {
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
    console.log('GET /reservations/writing : status 200');
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('GET /reservations/writing : status 500');
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

/**
 * TODO exception situation error handling
 * POST /
 * body : { name, birthDay, phoneNumber, type, reservationDate, reservationTime, memo}
 * 1. name, birthDay, phoneNumber, type, reservationDate, reservationTime이 없을 때
 * 2. 보낸 데이터가 형식에 맞지 않을 때 (birthDay, phoneNumber, type)
 * 3. 블랙리스트 유저가 예약을 시도했을 때
 * 4. 이미 예약된 시간에 예약 시도했을 때
 */

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
      // 예약 내역이 있는 유저
      if (userData.length) {
        const userId = userData[0];
        newReservation.user = userId;
        newReservation.type = getNumberType(type);
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
        // 예약 내역이 없는 유저
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
        newReservation.type = getNumberType(type);
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
