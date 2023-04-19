import { AppDataSource } from './data-source';
import { User } from './entity/User';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'wonny';
    user.lastName = 'bong';
    user.age = 100;
    await AppDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    console.log(
      'Here you can setup and run express / fastify / any other framework.'
    );
  })
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});
