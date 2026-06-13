import { Client } from 'discord.js';
import { deployCommands } from '../deploy-commands';

export const guildCreate = async ({ bot }: { bot: Client }) => {
  bot.on("guildCreate", async () => {
    await deployCommands();
  });
}