import { AppDataSource } from './db/data-source.js';
import { app } from './app.js';
import { env } from './config/env.js';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("🗄️  Ma'lumotlar bazasiga ulanish muvaffaqiyatli.");
  } catch (err) {
    console.error("❌ Ma'lumotlar bazasiga ulanishda xatolik:", err.message || err);
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 Backend http://localhost:${env.PORT} portida ishga tushdi.`);
  });
}

main();
