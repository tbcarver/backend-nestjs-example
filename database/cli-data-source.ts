import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_PATH,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['database/migrations/*.ts'],
  subscribers: [],
});
