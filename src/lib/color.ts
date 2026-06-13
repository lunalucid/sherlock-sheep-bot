import { HexColorString } from 'discord.js';

export const Color: Record<string, HexColorString> = {
  False: '#FF6262',
  True: '#6FFF62',
  Mixed: '#AD62FF',
  Uncertain: '#FFF862',
  Low: '#F8C042',
  Medium: '#DCFF42',
  High: '#42F9FF',
} as const;