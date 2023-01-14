import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'databases/backend_nestjs_example.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [],
});
