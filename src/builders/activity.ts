import { ActivityType } from 'discord.js';
import type { Client } from 'discord.js';
import type { ActivityOptions, Emoji } from 'discord.js';
import { emoji } from '../builders';

const defaultEmoji = emoji({ name: ':robot:' });
let bot: Client | null = null;

export const bindBot = (client: Client | null) => {
  bot = client;
};

export const botActivity = ({ description, emoji = defaultEmoji, type = ActivityType.Custom }: { description?: string, emoji?: Emoji, type?: ActivityType }) => {
  bot?.user?.setActivity(description || '', {
    type: type,
    emoji: emoji,
    name: description,
  } as ActivityOptions);
}

export const botThinking = () => {
  botActivity({ description: 'Thinking...', emoji: emoji({ name: 'thinking' }), type: ActivityType.Custom });
}

export const botFactChecking = () => {
  botActivity({ description: 'Fact Checking...', emoji: emoji({ name: 'mag' }), type: ActivityType.Custom });
}

export const botIdle = () => {
  botActivity({ description: '', emoji: emoji({ name: 'sleeping' }), type: ActivityType.Custom });
}

export const botListening = () => {
  botActivity({ description: '', emoji: emoji({ name: 'face_with_monocle' }), type: ActivityType.Listening });
}