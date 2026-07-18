import * as animeRepository from '../repositories/animeRepository.js';

export function registerCommandHandlers(bot) {
  bot.start((ctx) => {
    ctx.reply(
      'Salom! Men anime qidiruv botiman.\n\n' +
        '/qidir <anime nomi> - anime qidirish\n' +
        "/royxat - barcha anime ro'yxati\n" +
        "/ochir <anime nomi> - bazadan o'chirish\n\n" +
        "Yangi anime qo'shish uchun kanal postini (matn yoki rasm+matn) shunchaki tashlang."
    );
  });

  bot.command('qidir', async (ctx) => {
    const queryText = ctx.message.text.replace('/qidir', '').trim();
    if (!queryText) {
      return ctx.reply('Anime nomini ham yozing. Masalan: /qidir titanlarga hujum');
    }

    try {
      const anime = await animeRepository.findBySlug(queryText);
      if (!anime) return ctx.reply('Kechirasiz, bu anime topilmadi.');

      const channelsText = anime.channels
        .map((ch) => `• ${ch.channel} (${ch.quality || 'sifat nomalum'})`)
        .join('\n');

      const caption = `🎬 ${anime.title}\n📁 Janr: ${anime.genre || 'nomalum'}\n\nMavjud kanallar:\n${channelsText}`;

      if (anime.photo) {
        await ctx.replyWithPhoto(anime.photo, { caption });
      } else {
        await ctx.reply(caption);
      }
    } catch (err) {
      console.error('/qidir xatoligi:', err);
      ctx.reply("⚠️ Qidirishda xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring.");
    }
  });

  bot.command('royxat', async (ctx) => {
    try {
      const animeList = await animeRepository.listAll();
      const titles = animeList.map((a) => `• ${a.title}`).join('\n');
      ctx.reply(titles ? `Bazadagi anime'lar:\n\n${titles}` : "Baza hozircha bo'sh.");
    } catch (err) {
      console.error('/royxat xatoligi:', err);
      ctx.reply("⚠️ Ro'yxatni olishda xatolik yuz berdi.");
    }
  });

  bot.command('ochir', async (ctx) => {
    const queryText = ctx.message.text.replace('/ochir', '').trim();
    if (!queryText) {
      return ctx.reply('Anime nomini yozing. Masalan: /ochir titanlarga hujum');
    }

    try {
      const deleted = await animeRepository.deleteBySlug(queryText);
      ctx.reply(deleted ? `O'chirildi: ${queryText}` : 'Bunday anime bazada topilmadi.');
    } catch (err) {
      console.error('/ochir xatoligi:', err);
      ctx.reply("⚠️ O'chirishda xatolik yuz berdi.");
    }
  });
}
