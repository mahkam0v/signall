import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env.js';

import { Anime } from './entities/Anime.js';
import { Channel } from './entities/Channel.js';
import { User } from './entities/User.js';

const entities = [Anime, Channel, User];

function buildOptionsFromUrl(databaseUrl) {
  const isInternal = databaseUrl.includes('railway.internal');
  return {
    type: 'postgres',
    url: databaseUrl,
    synchronize: false,
    logging: false,
    entities,
    ssl: isInternal ? false : { rejectUnauthorized: false },
  };
}

function buildLocalOptions() {
  return {
    type: 'postgres',
    host: env.PG.host,
    port: env.PG.port,
    username: env.PG.user,
    password: env.PG.password,
    database: env.PG.database,
    synchronize: false,
    logging: false,
    entities,
    ssl: false,
  };
}

export let AppDataSource = new DataSource(
  env.DATABASE_URL ? buildOptionsFromUrl(env.DATABASE_URL) : buildLocalOptions()
);

export async function connectDatabase() {
  try {
    await AppDataSource.initialize();
    return AppDataSource;
  } catch (err) {
    const canFallback = env.DATABASE_URL && env.DATABASE_PUBLIC_URL;
    if (!canFallback) throw err;

    console.warn(
      "⚠️  Asosiy ulanish muvaffaqiyatsiz bo'ldi, DATABASE_PUBLIC_URL orqali qayta urinilyapti..."
    );
    console.warn('   Sabab:', err.message || err);

    AppDataSource = new DataSource(buildOptionsFromUrl(env.DATABASE_PUBLIC_URL));
    await AppDataSource.initialize();
    return AppDataSource;
  }
}