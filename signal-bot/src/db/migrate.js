import 'reflect-metadata';
import { AppDataSource } from './data-source.js';

// TypeORM entity'lari (Anime, Channel) sxemani o'zi tavsiflaydi, shuning uchun
// migratsiya shunchaki DataSource'ni ochib, synchronize() orqali jadvallarni
// yaratadi/moslashtiradi.
async function migrate() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize();
    console.log('✅ Migratsiya (TypeORM synchronize) muvaffaqiyatli bajarildi.');
  } catch (err) {
    console.error('❌ Migratsiya xatoligi:', err.message);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

migrate();
