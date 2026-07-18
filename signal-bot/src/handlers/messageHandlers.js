import pendingStore from '../state/pendingStore.js';
import { parsePost, findMissing } from '../services/postParser.js';
import { previewText } from '../services/previewService.js';
import { confirmKeyboard } from '../keyboards/confirmKeyboard.js';

export function registerMessageHandlers(bot) {
  bot.on('text', (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    const userId = ctx.from.id;
    const state = pendingStore.get(userId);

    if (state && state.waitingForTitle) {
      state.parsed.title = text.trim();
      state.waitingForTitle = false;
      pendingStore.set(userId, state);

      const photoStatus = state.photo ? '✅ mavjud' : '⚠️ rasm yuklanmagan';
      if (state.photo) {
        ctx.replyWithPhoto(state.photo, { caption: previewText(state.parsed, photoStatus), ...confirmKeyboard });
      } else {
        ctx.reply(previewText(state.parsed, photoStatus), confirmKeyboard);
      }
      return;
    }

    const parsed = parsePost(text);
    const missing = findMissing(parsed, false); // matnda rasm hech qachon bo'lmaydi

    if (missing.length > 0) {
      return ctx.reply(
        `⚠️ Post to'liq emas, saqlanmadi.\n\nYetishmayapti:\n` +
          missing.map((m) => `• ${m}`).join('\n') +
          `\n\nIltimos rasm bilan birga, barcha ma'lumotlarni (Qism, Sifat, Janrlari, Kanal) kiritib qayta yuboring.`
      );
    }

    pendingStore.set(userId, { parsed, photo: null });
    ctx.reply(previewText(parsed, '✅ mavjud'), confirmKeyboard);
  });

  // Rasm + matn (caption) kelganda
  bot.on('photo', (ctx) => {
    const caption = ctx.message.caption || '';
    if (!caption) {
      return ctx.reply("Rasmga matn (caption) qo'shilmagan, anime ma'lumotini aniqlay olmadim.");
    }

    const parsed = parsePost(caption);
    const missing = findMissing(parsed, true);

    if (missing.length > 0) {
      return ctx.reply(
        `⚠️ Post to'liq emas, saqlanmadi.\n\nYetishmayapti:\n` +
          missing.map((m) => `• ${m}`).join('\n') +
          `\n\nIltimos captionda barcha ma'lumotlarni to'ldirib qayta yuboring.`
      );
    }

    const photos = ctx.message.photo;
    const fileId = photos[photos.length - 1].file_id;

    const userId = ctx.from.id;
    pendingStore.set(userId, { parsed, photo: fileId });

    ctx.replyWithPhoto(fileId, {
      caption: previewText(parsed, '✅ mavjud'),
      ...confirmKeyboard,
    });
  });
}
