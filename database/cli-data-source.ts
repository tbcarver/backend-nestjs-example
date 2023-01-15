import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'better-sqlite3',
  database: 'database/sqlite3/backend_nestjs_example.sqlite3',
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['database/migrations/*.ts'],
  subscribers: [],
});
