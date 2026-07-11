import 'reflect-metadata';
import { AppDataSource } from './data-source.js';

// "anime" va "channels" jadvallarini signal-bot allaqachon yaratgan, va bu
// loyihadagi entity'lar ular bilan aynan bir xil - shuning uchun synchronize()
// ularga tegmaydi, faqat yangi "users" jadvalini yaratadi.
async function migrate() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize();
    console.log('✅ Migratsiya muvaffaqiyatli bajarildi ("users" jadvali tayyor).');
  } catch (err) {
    console.error('❌ Migratsiya xatoligi:', err.message);
    process.exitCode = 1;
  } finally {
    await AppDataSource.destroy();
  }
}

migrate();
