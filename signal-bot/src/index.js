require('reflect-metadata');
const { AppDataSource } = require('./db/data-source');
const bot = require('./bot');

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('🗄️  Ma\'lumotlar bazasiga ulanish muvaffaqiyatli.');
  } catch (err) {
    console.error('❌ Ma\'lumotlar bazasiga ulanishda xatolik:', err.message);
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
