import 'reflect-metadata';
import { DataSource } from 'typeorm';
import env from '../config/env.js';

import Anime from './entities/Anime.js';
import Channel from './entities/Channel.js';

// DATABASE_URL bo'lsa o'shani, bo'lmasa host/port/user/pass/db orqali ulanamiz.
// Render'ning tashqi (public/external) manzili orqali ulanganda SSL talab
// qilinadi, shuning uchun "localhost" bo'lmasa SSL yoqiladi.
const connectionOptions = env.DATABASE_URL
  ? {
      url: env.DATABASE_URL,
      ssl: env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    }
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
  entities: [Anime, Channel],
});
