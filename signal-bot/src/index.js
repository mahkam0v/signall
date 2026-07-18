// import 'reflect-metadata';
// import { AppDataSource } from './db/data-source.js';
// import bot from './bot.js';

// async function main() {
//   try {
//     await AppDataSource.initialize();
//     console.log("🗄️  Ma'lumotlar bazasiga ulanish muvaffaqiyatli.");
//   } catch (err) {
//     console.error("❌ Ma'lumotlar bazasiga ulanishda xatolik:", err.message);
//     process.exit(1);
//   }

//   await bot.launch();
//   console.log('Bot ishga tushdi...');
// }

// main();

// process.once('SIGINT', async () => {
//   bot.stop('SIGINT');
//   if (AppDataSource.isInitialized) await AppDataSource.destroy();
// });
// process.once('SIGTERM', async () => {
//   bot.stop('SIGTERM');
//   if (AppDataSource.isInitialized) await AppDataSource.destroy();
// });

import 'reflect-metadata';
import http from 'http';
import { AppDataSource } from './db/data-source.js';
import bot from './bot.js';

// Render "Web Service" turi doim bitta portni tinglashni kutadi, aks holda
// "Port scan timeout" deb deploy'ni muvaffaqiyatsiz deb hisoblaydi. Bot esa
// portni tinglamaydi (Telegram bilan long-polling orqali ishlaydi), shuning
// uchun shu arzimas HTTP serverni ochib qo'yamiz - u faqat Render'ning port
// tekshiruvidan o'tish uchun, botning ishiga hech qanday aloqasi yo'q.
const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Signal bot ishlayapti.');
  })
  .listen(PORT, () => {
    console.log(`🌐 Dummy HTTP server ${PORT} portida ochildi (Render port tekshiruvi uchun).`);
  });

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("🗄️  Ma'lumotlar bazasiga ulanish muvaffaqiyatli.");
  } catch (err) {
    console.error("❌ Ma'lumotlar bazasiga ulanishda xatolik:", err.message);
    process.exit(1);
  }

  await bot.launch();
  console.log('Bot ishga tushdi...');
}

main();

process.once('SIGINT', async () => {
  bot.stop('SIGINT');
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
});
process.once('SIGTERM', async () => {
  bot.stop('SIGTERM');
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
});