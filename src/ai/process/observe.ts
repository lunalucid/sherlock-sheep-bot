import { configuration } from '../../config';
import { Message } from 'discord.js';
import openAI from '../openAI';
import { quickCorrection } from './quickCorrection';
import { factCheck } from './factCheck';
import { Emoji } from '../../lib/emoji';
import { botFactChecking, botListening } from '../../builders/activity';

const IS_DIRECTED_AT_BOT_TERNARY_OP_STRING = `**\${ isDirectedAtBot ? '${ configuration.OBSERVER_IS_DIRECTED_AT_BOT_NOTE || '(missing details)' }' : '${ configuration.OBSERVER_IS_NOT_DIRECTED_AT_BOT_NOTE || '(missing details)' }' \}**`

const INSTRUCTIONS_PART_1 = `You are a fact-check classification assistant.
Your name: ${ configuration.BOT_NAME || '' }
Your identity: ${ configuration.BOT_IDENTITY || '' }
Your traits: ${ configuration.BOT_TRAITS || '' }`

const INSTRUCTIONS_PART_2 = `${ configuration.OBSERVER_FOOTNOTE || '' }

${ configuration.OBSERVER_SYSTEM_INSTRUCTIONS || '' }`

export type observeResponseJson = {
  classification: '__NONE__' | '__FACT_CHECK__' | '__TRUE__' | '__FALSE__' | '__SATIRE__';
  query?: string | null;
  correction?: string | null;
}

export const observe = async (message: Message, followUp: boolean, contentOverride?: string) => {
  botListening();
  const content = contentOverride ?? message.content;

  if (!message || !content) {
    return;
  }

  let isDirectedAtBot = false;
  const botMention = `<@${ message.client.user?.id }>`;
  const messageIsReplyToBot = message.reference && message.reference.messageId && (await message.channel.messages.fetch(message.reference.messageId)).author.id === message.client.user?.id;

  if (content.includes(botMention) || messageIsReplyToBot) {
    isDirectedAtBot = true;
  }

  const instructions = `
${ INSTRUCTIONS_PART_1 }

**${ isDirectedAtBot ? `${ configuration.OBSERVER_IS_DIRECTED_AT_BOT_NOTE || '' }` : `${ configuration.OBSERVER_IS_NOT_DIRECTED_AT_BOT_NOTE || '' }` }**

${ INSTRUCTIONS_PART_2 }`

  const response = await openAI.responses.create({
    instructions: configuration.OBSERVER_INSTRUCTIONS,
    model: configuration.OBSERVER_MODEL,
    input: [
      {
        role: 'system',
        content: instructions,
      },
      {
        role: 'user',
        content,
      },
    ]
  });
  let responseJson: observeResponseJson | null = null;
  try {
    responseJson = JSON.parse(response.output_text) as observeResponseJson;
  } catch (err) {
    console.error('Failed to parse response.output_text as JSON:', response.output_text, err);
    return;
  }

  switch (responseJson.classification) {
    case '__NONE__':
      if (followUp) {
        message.react(Emoji.Confused);
        console.log(`Invalid claim to fact-check: "${ content }"`);
        return;
      }
      return;
    case '__FACT_CHECK__':
      console.log(`Fact-checking: "${ responseJson.query || content }"`);
      botFactChecking();
      return factCheck({ message, responseJson });
    case '__TRUE__':
      message.react(Emoji.True);
      console.log(`Claim marked true: "${ responseJson.query || content }"`);
      return;
    case '__FALSE__':
      message.react(Emoji.False);
      //console.log(`False claim: "${ responseJson.query || content }"\nCorrection: "${ responseJson.correction || 'No correction provided' }"`);
      console.log(`False claim: "${ responseJson.query || content }"`);
      return quickCorrection(responseJson, message);
    case '__SATIRE__':
      message.react(followUp ? Emoji.Confused : Emoji.Satire);
      console.log(`Claim marked as satire: "${ responseJson.query || content }"`);
      return;
    default:
      return;
  }
}

export const instructions = `
${ INSTRUCTIONS_PART_1 }

${ IS_DIRECTED_AT_BOT_TERNARY_OP_STRING }

${ INSTRUCTIONS_PART_2 }
`
