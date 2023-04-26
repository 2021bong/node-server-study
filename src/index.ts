import { AppDataSource } from './data-source';
import express from 'express';
import cors from 'cors';
import router from './api';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(router);

AppDataSource.initialize()
  .then(async () => {
    console.log('Success Connect DB!');
  })
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
