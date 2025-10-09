import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'), //5433 in my case
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'tasks',
  synchronize: false, // newer have it set to true in production
  entities: ['dist/**/*.entity{.ts, js}'],
  migrations: ['dist/migrations/*.{.ts, js}'],
});
