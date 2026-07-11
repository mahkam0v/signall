const { Markup } = require('telegraf');

const confirmKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('✅ Saqlash', 'confirm')],
  [Markup.button.callback("✏️ Nomini o'zgartirish", 'edit_title')],
  [Markup.button.callback('❌ Bekor qilish', 'cancel')],
]);

module.exports = { confirmKeyboard };
