import 'dotenv/config';

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const DB = {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

export const SMTP_INFO = {
  host: process.env.SMTP_HOST!,
  user: process.env.SMTP_USER!,
  password: process.env.SMTP_PASSWORD!,
  port: process.env.SMTP_PORT!,
};
