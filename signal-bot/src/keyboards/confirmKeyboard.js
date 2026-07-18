import { Markup } from 'telegraf';

export const confirmKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('✅ Saqlash', 'confirm')],
  [Markup.button.callback("✏️ Nomini o'zgartirish", 'edit_title')],
  [Markup.button.callback('❌ Bekor qilish', 'cancel')],
]);
