import { Client } from 'discord.js';
import { getCommandMap } from '../util';

export const interactionCreate = async ({ bot }: { bot: Client }) => {
  bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const commandMap = getCommandMap();
    const command = commandMap.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  });
}
