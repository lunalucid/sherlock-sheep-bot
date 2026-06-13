import { ChatInputCommandInteraction, Message } from 'discord.js';
import { moderate } from './moderate';
import { observe } from './observe';
import { botIdle } from '../../builders/activity';

export const process = async ({ message, interaction, followUp = false }: { message?: Message, interaction?: ChatInputCommandInteraction, followUp?: boolean }) => {
  let content;
  let authorIsBot = false;
  if (!message && !interaction) {
    console.error('No message or interaction provided to process function');
    botIdle();
    return;
  }
  if (interaction) {
    message = await interaction.fetchReply();
    content = interaction.options.getString('claim', true);
  } else if (message) {
    content = message.content;
    authorIsBot = message.author.bot;
  } else {
    console.error('No message or interaction provided to process function');
    botIdle();
    return;
  }

  if (!content || authorIsBot) return;

  try {
    const moderationResult = await moderate(content);

    if (typeof moderationResult === 'string' && moderationResult.trim() === '__BLOCK__') {
      console.log(`Moderation blocked message: "${ message.content }"`);
      return;
    }

    await observe(message, followUp, content);
  } catch (error) {
    console.error('Message processing failed:', error);
  }
}
