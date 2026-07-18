import pendingStore from '../state/pendingStore.js';
import * as animeRepository from '../repositories/animeRepository.js';
import { downloadPhotoToLocal } from '../services/imageStorage.js';
import { slugify } from '../services/postParser.js';

// Eski koddagi bug: ctx.editMessageReplyMarkup() argumentsiz chaqirilganda,
// agar xabar allaqachon o'zgartirilgan yoki eskirgan bo'lsa Telegram API xato qaytarib,
// bot butun handler'ni yiqitib yuborishi mumkin edi. Endi har doim try/catch bilan o'raymiz.
async function safeRemoveKeyboard(ctx) {
  try {
    await ctx.editMessageReplyMarkup(undefined);
  } catch (err) {
    console.warn("Tugmalarni olib tashlashda ogohlantirish (e'tiborsiz qoldiriladi):", err.message);
  }
}

export function registerActionHandlers(bot) {
  bot.action('confirm', async (ctx) => {
    const userId = ctx.from.id;
    const state = pendingStore.get(userId);

    if (!state || !state.parsed.title) {
      return ctx.answerCbQuery("Xatolik: ma'lumot topilmadi, qaytadan yuboring.");
    }

    try {
      // file_id saytda ishlamaydi (u faqat Telegram Bot API orqali ochiladi),
      // shuning uchun haqiqiy rasm baytlarini /uploads papkasiga yuklab olamiz.
      let photoUrl = null;
      let photoFailed = false;
      if (state.photo) {
        try {
          const slug = slugify(state.parsed.title);
          const fileName = await downloadPhotoToLocal(ctx.telegram, state.photo, slug);
          photoUrl = `/uploads/${fileName}`;
        } catch (downloadErr) {
          photoFailed = true;
          console.error(
            `❌ Rasm yuklab olinmadi ("${state.parsed.title}"):`,
            downloadErr
          );
        }
      }

      await animeRepository.saveParsedPost({
        title: state.parsed.title,
        genre: state.parsed.genre,
        photo: state.photo,
        photoUrl,
        channel: state.parsed.channel || 'nomalum',
        quality: state.parsed.quality,
        episode: state.parsed.episode,
      });

      pendingStore.delete(userId);
      await safeRemoveKeyboard(ctx);
      await ctx.answerCbQuery('Saqlandi ✅');
      await ctx.reply(
        photoFailed
          ? `"${state.parsed.title}" bazaga saqlandi, LEKIN rasm yuklab olinmadi (saytda ko'rinmaydi). Terminaldagi xatoni tekshir.`
          : `"${state.parsed.title}" bazaga saqlandi.`
      );
    } catch (err) {
      console.error('confirm xatoligi:', err);
      await ctx.answerCbQuery('Saqlashda xatolik yuz berdi');
      await ctx.reply("⚠️ Bazaga saqlashda xatolik yuz berdi, qaytadan urinib ko'ring.");
    }
  });

  bot.action('edit_title', async (ctx) => {
    const userId = ctx.from.id;
    const state = pendingStore.get(userId);
    if (!state) return ctx.answerCbQuery("Ma'lumot topilmadi.");

    state.waitingForTitle = true;
    pendingStore.set(userId, state);

    await ctx.answerCbQuery();
    await ctx.reply("To'g'ri anime nomini yozib yuboring:");
  });

  bot.action('cancel', async (ctx) => {
    const userId = ctx.from.id;
    pendingStore.delete(userId);

    await safeRemoveKeyboard(ctx);
    await ctx.answerCbQuery('Bekor qilindi');
    await ctx.reply('Bekor qilindi, hech narsa saqlanmadi.');
  });
}
