import { Client } from 'discord.js';
import { botListening } from '../builders/activity';

export const typingStart = async ({ bot }: { bot: Client }) => {
  bot.on("typingStart", (typing) => {
    if (typing.user.bot) return;
    botListening();
  });
}