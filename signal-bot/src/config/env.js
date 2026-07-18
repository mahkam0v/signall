import dotenv from 'dotenv';
dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Environment o'zgaruvchi topilmadi: ${name} (.env faylni tekshiring)`);
  }
  return value;
}

export default {
  BOT_TOKEN: required('BOT_TOKEN'),

  DATABASE_URL: process.env.DATABASE_URL || null,
  PG: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'signal_bot',
  },
};
