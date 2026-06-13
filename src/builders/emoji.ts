import { Emoji } from 'discord.js';

export const emoji = ({ name, id, animated }: { name?: string | null, id?: string | null, animated?: boolean }) => {
  return { name: name || null, id: id || null, animated: animated || false } as Emoji;
}