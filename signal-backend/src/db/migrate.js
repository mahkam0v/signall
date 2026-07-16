import 'reflect-metadata';
import { connectDatabase } from './data-source.js';

// "anime" va "channels" jadvallarini signal-bot allaqachon yaratgan, va bu
// loyihadagi entity'lar ular bilan aynan bir xil - shuning uchun synchronize()
// ularga tegmaydi, faqat yangi "users" jadvalini yaratadi.
async function migrate() {
  let dataSource;
  try {
    dataSource = await connectDatabase();
    await dataSource.synchronize();
    console.log('✅ Migratsiya muvaffaqiyatli bajarildi ("users" jadvali tayyor).');
  } catch (err) {
    console.error('❌ Migratsiya xatoligi:', err.message);
    process.exitCode = 1;
  } finally {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  }
}

migrate();