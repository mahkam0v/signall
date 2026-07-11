const fs = require('fs');
const path = require('path');
const https = require('https');

// Barcha yuklab olingan rasmlar shu papkaga tushadi (loyihaning tub papkasida /uploads).
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// MUHIM: Telegram file_id saytda (yoki har qanday oddiy <img src="...">) ishlamaydi -
// u faqat bot tokeni orqali Telegram Bot API'dan olinadigan vaqtinchalik havola.
// Shuning uchun bu funksiya file_id orqali HAQIQIY rasm baytlarini yuklab olib,
// serverning /uploads papkasiga saqlaydi va oddiy fayl nomini qaytaradi -
// shu nomni saytda "/uploads/<fileName>" ko'rinishida to'g'ridan-to'g'ri ishlatish mumkin.
async function downloadPhotoToLocal(telegram, fileId, slug) {
  const fileLink = await telegram.getFileLink(fileId);
  const href = typeof fileLink === 'string' ? fileLink : fileLink.href;

  const ext = path.extname(new URL(href).pathname) || '.jpg';
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, '_');
  const fileName = `${safeSlug}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  await new Promise((resolve, reject) => {
    https
      .get(href, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Rasm yuklab olishda xatolik: HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => fileStream.close(() => resolve()));
        fileStream.on('error', reject);
      })
      .on('error', reject);
  });

  return fileName;
}

module.exports = { downloadPhotoToLocal, UPLOAD_DIR };
