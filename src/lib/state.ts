import { ActivityType } from 'discord.js';
import type { Client } from 'discord.js';
import type { ActivityOptions, ClientPresenceStatus } from 'discord.js';
import { BotAvatar } from './avatar';

const emojis = {
  smile: '🙂',
  sleep: '😴',
  nerdy: '🤓',
  cool: '😎',
  angel: '😇',
  mouthless: '😶',
  upsidedown: '🙃',
}

let bot: Client | null = null;

export const bindBot = (client: Client | null) => {
  bot = client;
};

export const setBotActivity = ({ description, type = ActivityType.Custom }: { description?: string, type?: ActivityType }) => {
  bot?.user?.setActivity(description || '', {
    type: type,
    name: description,
  } as ActivityOptions);
}

export const setBotStatus = ({ status }: { status: ClientPresenceStatus }) => {
  bot?.user?.setStatus(status);
}

export const botThinking = () => {
  setBotActivity({ description: '🤔', type: ActivityType.Custom });
}

export const botFactChecking = () => {
  setBotActivity({ description: '🔍 ...', type: ActivityType.Custom });
}

export const botIdle = () => {
  const randomEmoji = Object.values(emojis)[Math.floor(Math.random() * Object.values(emojis).length)];
  setBotActivity({ description: randomEmoji, type: ActivityType.Custom });
  BotAvatar.Random();
}

export const botListening = () => {
  setBotActivity({ description: '🧐', type: ActivityType.Custom });
}
