
import { Client } from 'discord.js';
import { process } from '../ai/process';

export const messageCreate = async ({ bot }: { bot: Client }) => {
  bot.on("messageCreate", async (message) => {
    process({ message });
  });
}
