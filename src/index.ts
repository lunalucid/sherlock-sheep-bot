import { Client } from 'discord.js'
import { configuration, intents } from './config';
import { bindBot } from './builders/activity';
import * as event from './events';

export const bot = new Client({
  intents: intents,
});
bindBot(bot);

event.ready({ bot });
event.guildCreate({ bot });
event.messageCreate({ bot });
event.interactionCreate({ bot });
event.typingStart({ bot });

process.on('SIGINT', () => {
  console.log('Interrupted. Exiting cleanly.');
  process.exit();
});

bot.login(configuration.DISCORD_BOT_TOKEN)
