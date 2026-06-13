import { Message } from 'discord.js';
import { Emoji } from '../../lib/emoji';
import { botIdle } from '../../builders/activity';
import { observeResponseJson } from './observe';

export const quickCorrection = (content: observeResponseJson, message: Message) => {
  message.react(Emoji.False);
  message.reply(`${ content.correction }`);
  botIdle();
  return;
}