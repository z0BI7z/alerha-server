import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { authRoutes } from './routes';
import { databaseUrl } from './config';

async function main() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/auth', authRoutes);

  app.get('/', (req, res) => {
    res.status(200).json('Hey');
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Does not exist.'
    });
  });

  await mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  app.listen(3000);
}

main();