import { Router, Request, Response } from 'express';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userData = await userRepository.find();
    res.status(200).send(userData);
    console.log('GET /reservations : status 200');
    console.log('userData.length : ', userData.length);
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('GET /reservations : status 500');
    console.log(err);
  }
});

interface PostUserRequest extends Request {
  name: string;
  age: number;
  sex: string;
  phoneNumber: string;
  symptom: string;
  reservationTime: string;
}

router.post('/', async (req: PostUserRequest, res: Response) => {
  const { name, age, sex, phoneNumber, symptom, reservationTime } = req.body;
  const [date, time] = reservationTime.split(' ');
  const userData = await AppDataSource.getRepository(User).find({
    where: { reservation_date: date, reservation_time: time },
  });
  if (userData.length) {
    res.status(409).send({ message: 'The time is already scheduled.' });
    console.log('POST /reservations : status 409');
    return;
  }

  try {
    const user = new User();
    user.name = name;
    user.age = age;
    user.sex = sex;
    user.phone_number = phoneNumber;
    user.symptom = symptom;
    user.reservation_date = date;
    user.reservation_time = time;
    user.created_at = new Date();

    const newUser = await AppDataSource.getRepository(User).save(user);
    res.status(200).send(newUser);
    console.log('POST /reservations : status 200');
  } catch (err) {
    res.status(500).send({ message: err });
    console.log('POST /reservations status : 500');
    console.log(err);
  }
});

export default router;
