import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userData = await userRepository.find();
    console.log('userData : ', userData);
    res.status(200).send(userData);
  } catch (err) {
    res.status(500).send({ message: err });
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

router.post('/user', async (req: PostUserRequest, res: Response) => {
  const { name, age, sex, phoneNumber, symptom, reservationTime } = req.body;
  try {
    const user = new User();
    user.name = name;
    user.age = age;
    user.sex = sex;
    user.phone_number = phoneNumber;
    user.symptom = symptom;
    user.reservation_time = reservationTime;
    user.created_at = new Date();

    const newUser = await AppDataSource.getRepository(User).save(user);
    res.status(200).send(newUser);
  } catch (err) {
    console.log('Error! : ', err);
    res.send({ message: err });
  }
});

export default router;
