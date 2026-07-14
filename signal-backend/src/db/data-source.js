import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env.js';

import { Anime } from './entities/Anime.js';
import { Channel } from './entities/Channel.js';
import { User } from './entities/User.js';

const connectionOptions = env.DATABASE_URL
  ? { url: env.DATABASE_URL }
  : {
      host: env.PG.host,
      port: env.PG.port,
      username: env.PG.user,
      password: env.PG.password,
      database: env.PG.database,
    };

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...connectionOptions,
  synchronize: false,
  logging: false,
  entities: [Anime, Channel, User],

  // Railway PostgreSQL (public/proxy manzil orqali ulanganda) SSL talab qiladi.
  // Ichki (internal) manzil orqali ulansa bunga ehtiyoj yo'q, lekin true qoldirish
  // xavfsiz - internal ulanishda ham xato bermaydi.
  ssl: env.DATABASE_URL
  ? { rejectUnauthorized: false }
  : false,
});