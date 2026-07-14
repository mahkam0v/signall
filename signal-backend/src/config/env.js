import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT || 4000),

  JWT_SECRET: process.env.JWT_SECRET || 'signal-dev-secret-CHANGE-ME',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  DATABASE_URL: process.env.DATABASE_URL || '',

  PG: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'AniDb',
  },
  
  UPLOADS_DIR: process.env.UPLOADS_DIR || './uploads',
};
