import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const DBConfig = new DataSource({
  type: process.env.DB_TYPE as "mysql" | "postgres" | "mongodb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  migrations: ['src/Database/Migration/**/*.ts']
});
