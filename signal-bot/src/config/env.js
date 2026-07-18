require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Environment o'zgaruvchi topilmadi: ${name} (.env faylni tekshiring)`);
  }
  return value;
}

module.exports = {
  BOT_TOKEN: required('BOT_TOKEN'),

  DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL || null,
  PG: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'signal_bot',
  },
};
