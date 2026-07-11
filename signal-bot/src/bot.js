const { Telegraf } = require('telegraf');
const env = require('./config/env');

const { registerCommandHandlers } = require('./handlers/commandHandlers');
const { registerMessageHandlers } = require('./handlers/messageHandlers');
const { registerActionHandlers } = require('./handlers/actionHandlers');

const bot = new Telegraf(env.BOT_TOKEN);

registerCommandHandlers(bot);
registerMessageHandlers(bot);
registerActionHandlers(bot);

// Ushlanmagan xatoliklar butun botni o'chirib qo'ymasin
bot.catch((err, ctx) => {
  console.error(`Kutilmagan xatolik (update ${ctx.updateType}):`, err);
});

module.exports = bot;
