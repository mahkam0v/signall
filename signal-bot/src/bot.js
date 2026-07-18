import { Telegraf } from 'telegraf';
import env from './config/env.js';

import { registerCommandHandlers } from './handlers/commandHandlers.js';
import { registerMessageHandlers } from './handlers/messageHandlers.js';
import { registerActionHandlers } from './handlers/actionHandlers.js';

const bot = new Telegraf(env.BOT_TOKEN);

registerCommandHandlers(bot);
registerMessageHandlers(bot);
registerActionHandlers(bot);

// Ushlanmagan xatoliklar butun botni o'chirib qo'ymasin
bot.catch((err, ctx) => {
  console.error(`Kutilmagan xatolik (update ${ctx.updateType}):`, err);
});

export default bot;
