import { Router, Request, Response } from 'express';
import reservationRouter from './reservationRouter';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

router.use('/reservations', reservationRouter);

export default router;
