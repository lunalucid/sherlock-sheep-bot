import { Client } from 'discord.js';
import { deployCommands } from '../deploy-commands';
import { botIdle } from '../builders/activity';

export const ready = async ({ bot, emit }: { bot: Client, emit?: (event: string, data: unknown) => void }) => {
  bot.once("ready", async () => {
    emit?.('ready', {
      tag: bot.user?.tag || bot.user?.username || 'Online',
      id: bot.user?.id || '',
    });
    deployCommands(bot);
    botIdle();
    console.log(`${ bot.user?.globalName || bot.user?.username } online`);
  });
}
