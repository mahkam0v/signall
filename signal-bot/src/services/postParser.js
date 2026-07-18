// Anime nomini bazada izchil qidirish/saqlash uchun normalizatsiya qilamiz.
// Eski koddagi bug: /qidir'da faqat toLowerCase ishlatilgan, lekin ortiqcha bo'shliqlar
// yoki boshida/oxirida probel bo'lsa ikkita "bir xil" anime alohida yozuv sifatida saqlanardi.
export function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Kanal postidan ma'lumotlarni ajratib olish
export function parsePost(text) {
  const result = {};
  const firstLine = text.split('\n')[0].trim();
  result.title = firstLine.replace(/[╭─•|#]/g, '').trim();

  const qismMatch = text.match(/Qism[:\s]*(\d+)/i) || text.match(/QISM[\s-]*(\d+)/i);
  result.episode = qismMatch ? qismMatch[1] : null;

  const sifatMatch = text.match(/(\d{3,4}p)/g);
  result.quality = sifatMatch ? sifatMatch.join(', ') : null;

  const janrMatch = text.match(/Janrlari?[:\s]*([^\n├╰]+)/i);
  result.genre = janrMatch ? janrMatch[1].trim() : null;

  const kanalMatch = text.match(/@(\w+)/);
  result.channel = kanalMatch ? '@' + kanalMatch[1] : null;

  return result;
}

// Barcha kerakli maydon to'lganini tekshiradi, yetishmaganlarni ro'yxat qilib qaytaradi
export function findMissing(parsed, hasPhoto) {
  const missing = [];
  if (!parsed.title) missing.push('Nomi');
  if (!parsed.episode) missing.push('Qism raqami (masalan "Qism: 1")');
  if (!parsed.quality) missing.push('Sifat (masalan "720p")');
  if (!parsed.genre) missing.push('Janr (masalan "Janrlari: ...")');
  if (!parsed.channel) missing.push("Kanal (@nomi ko'rinishida)");
  if (!hasPhoto) missing.push('Rasm (post rasm bilan yuborilishi kerak)');
  return missing;
}
