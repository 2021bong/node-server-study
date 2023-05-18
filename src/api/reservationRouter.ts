import { Router, Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import getReservationId from '../utils/getReservationId';
import getStringType from '../utils/getStringType';
import { FindOptionsSelect } from 'typeorm';

const router = Router();

const showColumn = [
  'name',
  'birth_day',
  'phone_number',
  'reservation_date',
  'reservation_time',
  'memo',
  'reservation_id',
] as FindOptionsSelect<User>;

router.get('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

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
      const userDatas = await userRepository.find({
        where: { name, phone_number },
        select: showColumn,
      });

      if (userDatas.length) {
        res.status(200).send(userDatas);
      } else {
        res.status(204).send([]);
      }
    } else {
      const reservation_id = req.query.reservation_id as string;
      if (!reservation_id) {
        res.status(400).send({ message: 'There is no required values.' });
        return;
      }
      const userDatas = await userRepository.find({
        where: { reservation_id },
        select: showColumn,
      });

      if (userDatas.length) {
        res.status(200).send(userDatas);
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

interface PostUserRequest extends Request {
  name: string;
  birthDay: string;
  phoneNumber: string;
  type: string;
  reservationDate: string;
  reservationTime: string;
  memo?: string;
}

interface PostUserResponse extends Response {
  name: string;
  phoneNumber: string;
  reservationType: string;
  reservationId: string;
}

router.post('/', async (req: PostUserRequest, res: PostUserResponse) => {
  const {
    name,
    birthDay,
    phoneNumber,
    type,
    reservationDate,
    reservationTime,
    memo,
  } = req.body;
  const userData = await AppDataSource.getRepository(User).find({
    where: {
      reservation_date: reservationDate,
      reservation_time: reservationTime,
    },
  });
  if (userData.length) {
    res.status(409).send({ message: 'The time is already scheduled.' });
    console.log('POST /reservations : status 409');
    return;
  }

  try {
    const user = new User();
    user.name = name;
    user.birth_day = birthDay;
    user.phone_number = phoneNumber.replaceAll('-', '');
    switch (type) {
      case '건강검진':
        user.type = 2;
        break;
      case '정밀검사':
        user.type = 3;
        break;
      case '기타':
        user.type = 4;
        break;
      case '일반진료':
      default:
        user.type = 1;
    }
    user.reservation_date = reservationDate;
    user.reservation_time = reservationTime;
    user.reservation_id = getReservationId(user);
    user.memo = memo || null;
    user.created_at = new Date();
    const newUser = await AppDataSource.getRepository(User).save(user);
    const PostUserResponse = {
      name: newUser.name,
      reservationId: newUser.reservation_id,
      phoneNumber: newUser.phone_number,
      reservationType: getStringType(newUser.type),
    };
    res.status(200).send(PostUserResponse);
    console.log('POST /reservations : status 200');
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('POST /reservations status : 500');
    console.log(err);
  }
});

export default router;
