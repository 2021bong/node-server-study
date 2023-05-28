import { AppDataSource } from './data-source';
import express from 'express';
import cors from 'cors';
import router from './api';
import bodyParser from 'body-parser';
import { AppointmentType } from './entity/AppointmentType';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(router);

AppDataSource.initialize()
  .then(async () => {
    const appointmentDB = AppDataSource.getRepository(AppointmentType);
    const crucialType = await appointmentDB.find();
    if (crucialType.length !== 4) {
      const typeArr = ['일반진료', '건강검진', '서류발급', '기타'];
      typeArr.forEach((type) => {
        const dataObj = new AppointmentType();
        dataObj.type = type;
        appointmentDB.save(dataObj);
      });
    }

    console.log('AppointmentType data organized complete!');
    console.log('Success Connect DB!');
  })
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
