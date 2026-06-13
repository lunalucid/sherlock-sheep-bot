import { GatewayIntentBits } from 'discord.js';

export const intents = [
  GatewayIntentBits.DirectMessagePolls,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildExpressions,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];