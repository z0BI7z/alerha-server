import { config } from 'dotenv';

const envFound = config();

if (envFound.error) {
  throw Error('Could not find .env file.');
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost/auth_demo';

export {
  port,
  databaseUrl,
}