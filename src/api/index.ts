import { Router, Request, Response } from 'express';
import reservationRouter from './reservationRouter';
import requestDeepl from './requestDeepl';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

router.use('/reservations', reservationRouter);

router.use('/deepl', requestDeepl);

export default router;
