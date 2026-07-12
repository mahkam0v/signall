import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 4000),

  JWT_SECRET: process.env.JWT_SECRET || 'signal-dev-secret-CHANGE-ME',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  DATABASE_URL: process.env.DATABASE_URL || null,
  PG: {
    host: process.env.DATABASE_URL || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'AniDb',
  },

  // signal-bot yuklagan rasmlar shu papkada turadi - ikkala loyiha bir xil
  // kompyuterda ishlagani uchun to'g'ridan-to'g'ri shu papkani serve qilamiz.
  UPLOADS_DIR: process.env.UPLOADS_DIR || '../signal-bot/uploads',
};
