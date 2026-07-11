require('reflect-metadata');
const { DataSource } = require('typeorm');
const env = require('../config/env');

const Anime = require('./entities/Anime');
const Channel = require('./entities/Channel');

// DATABASE_URL bo'lsa o'shani, bo'lmasa host/port/user/pass/db orqali ulanamiz
// (avvalgi pool.js bilan bir xil mantiq, endi TypeORM DataSource orqali)
const connectionOptions = env.DATABASE_URL
  ? { url: env.DATABASE_URL }
  : {
      host: env.PG.host,
      port: env.PG.port,
      username: env.PG.user,
      password: env.PG.password,
      database: env.PG.database,
    };

const AppDataSource = new DataSource({
  type: 'postgres',
  ...connectionOptions,
  synchronize: false,
  logging: false,
  entities: [Anime, Channel],
});

module.exports = { AppDataSource };
