import { DataSource } from 'typeorm';
import { DB } from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB.host,
  port: DB.port,
  username: DB.user,
  password: DB.password,
  database: DB.database,
  logging: true,
  synchronize: false,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});
