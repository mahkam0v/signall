// Test uchun: bitta file_id ni qo'lda rasmga aylantirib ko'rish.
// Ishlatish: node src/debugPhoto.js <file_id>
// file_id ni Telegramda botga rasm yuborib, konsoldagi logdan olishing mumkin
// (messageHandlers.js dagi bot.on('photo') qismida fileId shu yerda).
const env = require('./config/env');
const { downloadPhotoToLocal } = require('./services/imageStorage');
const { Telegraf } = require('telegraf');

async function main() {
  const fileId = process.argv[2];
  if (!fileId) {
    console.error('Foydalanish: node src/debugPhoto.js <file_id>');
    process.exit(1);
  }

  const bot = new Telegraf(env.BOT_TOKEN);

  console.log('1) BOT_TOKEN yuklandimi:', env.BOT_TOKEN ? `ha (${env.BOT_TOKEN.slice(0, 6)}...)` : "YO'Q!");
  console.log('2) getFile chaqirilmoqda...');

  try {
    const file = await bot.telegram.getFile(fileId);
    console.log('   ✅ getFile javobi:', file);
  } catch (err) {
    console.error('   ❌ getFile XATOLIK berdi:', err.message);
    console.error('   Bu odatda: file_id noto\'g\'ri/eskirgan, yoki BOT_TOKEN xato.');
    process.exit(1);
  }

  console.log('3) Rasmni to\'liq yuklab, diskka yozish...');
  try {
    const fileName = await downloadPhotoToLocal(bot.telegram, fileId, 'debug-test');
    console.log('   ✅ MUVAFFAQIYATLI! Fayl saqlandi:', fileName);
    console.log('   To\'liq yo\'l:', require('path').join(__dirname, '..', 'uploads', fileName));
  } catch (err) {
    console.error('   ❌ Yuklashda XATOLIK:', err);
  }
}

main();