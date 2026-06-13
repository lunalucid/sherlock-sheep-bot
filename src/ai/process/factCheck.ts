import { Message, EmbedBuilder, HexColorString, ChatInputCommandInteraction } from 'discord.js';
import { Emoji } from '../../lib/emoji';
import { Gif } from '../../lib/gif';
import { Verdict } from '../../lib/verdict';
import { botIdle } from '../../builders/activity';
import { Say } from '../../lib/say';
import { observeResponseJson } from './observe';
import { configuration } from '../../config';
import openAI from '../openAI';
import { zodTextFormat } from 'openai/helpers/zod';
import { factCheckResponseSchema } from '../factCheckResponseSchema';

export const instructions = `
Your name: ${ configuration.BOT_NAME || '' }
Your identity: ${ configuration.BOT_IDENTITY || '' }
Your traits: ${ configuration.BOT_TRAITS || '' }
${ configuration.FACT_CHECK_INSTRUCTIONS || 'You fact-check claims' }
`;


const clamp = (text: string | undefined | null, max: number) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
};

const joinSources = (
  sources?: { label?: string; url?: string; credibility?: string }[] | null,
  max = 700
) => {
  if (!sources?.length) return '';
  const full = sources
    .map(
      (source) =>
        `- [${ source.label ?? 'Source' }](${ source.url ?? '#' }) (${ source.credibility ?? 'Uncertain' } credibility)`
    )
    .join('\n');

  return full.length > max ? full.slice(0, max - 1) + '…' : full;
};

const factCheckResponseFormat = zodTextFormat(factCheckResponseSchema as any, 'fact_check_response');

const resultEmbed = ({ response, message, embed, sentMessage }:
  { response: any, message: Message, embed: EmbedBuilder, sentMessage: Message }) => {
  const r = response as any;

  console.log(`${ r.title ?? 'The Truth' } \nVerdict: ${ r.verdict ?? 'Uncertain' }`)

  embed.setImage(null);
  embed.setThumbnail(Gif.Idle());
  embed.setTitle(clamp(r.title ?? 'The Truth', 256));
  embed.setColor(Verdict.Color(r.verdict) as HexColorString);
  embed.setAuthor({
    name: `Verdict: ${ r.verdict ?? 'Uncertain' }`,
    iconURL: Verdict.Icon(r.verdict ?? 'Uncertain'),
  })
  embed.setDescription(clamp(r.introduction ?? 'No introduction provided.', 4000));
  let totalApprox = 0;

  if (r.bulletPoints && Array.isArray(r.bulletPoints)) {
    for (const point of r.bulletPoints) {
      const name = clamp(point.title ?? 'ℹ️', 256);
      const sourcesText = joinSources(point.sources);
      const value = clamp(
        `${ point.content ?? '*(missing content)*' }${ sourcesText ? `\n\nSources:\n${ sourcesText }` : '' }`,
        1024
      );

      const nextSize = name.length + value.length;
      if (totalApprox + nextSize > 5000) break;

      embed.addFields({ name, value });
      totalApprox += nextSize;
    }
  }

  embed.setFooter({
    text: `Reliability: ${ r.reliability ?? 'Unknown' }`,
    iconURL: Verdict.Icon(r.reliability ?? 'Unknown'),
  });

  embed.setTimestamp();
  sentMessage.edit({ embeds: [embed] });
  message.react(Verdict.Emoji(r.verdict ?? 'Unknown'));
  botIdle();
}

export const factCheck = async ({ message, interaction, responseJson, contentOverride }: { message?: Message, interaction?: ChatInputCommandInteraction, responseJson?: observeResponseJson, contentOverride?: string }) => {
  let content;
  if (interaction) {
    message = await interaction.fetchReply() as Message;
    content = contentOverride ?? interaction.options.getString('claim', true);
  }
  else {
    content = contentOverride ?? message?.content;
  }

  if (!message || !content) {
    botIdle();
    throw new Error('No message content to fact check.');
  }

  message.react(Emoji.Inspect);
  let embed = new EmbedBuilder()
    .setImage(Gif.Inspect())

  const sentMessage = await message.reply({ embeds: [embed] });

  try {
    const factCheckResponse = openAI.responses.stream({
      model: configuration.FACT_CHECK_MODEL || 'o4-mini',
      instructions,
      input: [
        {
          role: 'user',
          content,
        },
      ],
      tools: [
        {
          type: 'web_search',
          search_context_size: 'medium',
        },
      ],
      include: ['web_search_call.action.sources'],
      text: {
        format: factCheckResponseFormat as any,
      },
    });

    let searching = false;
    const searchPhrase = Say.search();
    let searches = 0;

    const foundPhrase = Say.found();

    for await (const event of factCheckResponse) {
      switch (event.type) {
        case 'response.created':
          console.log('Response started');
          continue;
        case 'response.in_progress':
          console.log('Response in progress');
          embed.setDescription(`### ${ responseJson && responseJson.query ? responseJson.query : 'Contemplating...' }`);
          sentMessage.edit({ embeds: [embed] });
          continue;
        case 'response.web_search_call.in_progress':
          if (!searching) {
            searching = true;
          }
          console.log('Web search process started');
          embed.setDescription(`${ responseJson && responseJson.query ? `### ${ responseJson.query }\n\n` : '' }## *${ searchPhrase }*\n${ searches } searches conducted`);
          sentMessage.edit({ embeds: [embed] });
          continue;
        case 'response.web_search_call.searching':
          if (!searching) {
            searching = true;
          }
          searches++;
          console.log(`Searching the web x${ searches }`);
          embed.setDescription(`${ responseJson && responseJson.query ? `### ${ responseJson.query }\n\n` : '' }## *${ searchPhrase }*\n${ searches } searches conducted`);
          sentMessage.edit({ embeds: [embed] });
          continue;
        case 'response.output_text.delta':
          if (searching) {
            searching = false;
            console.log('Response completed')
            embed.setDescription(`${ responseJson && responseJson.query ? `### ${ responseJson.query }\n\n` : '' }## *${ foundPhrase }*\n${ searches } searches conducted`);
            sentMessage.edit({ embeds: [embed] });
          }
          continue;
        default:
          continue;
      }
    }

    const finalResponse = await factCheckResponse.finalResponse();
    const responseObj = finalResponse.output_parsed ?? factCheckResponseSchema.parse(JSON.parse(finalResponse.output_text));

    resultEmbed({
      response: responseObj,
      message,
      embed,
      sentMessage,
    });
    return;
  } catch (error) {
    console.error('Fact-check stream failed:', error);
    embed.setDescription('An error occurred while fact-checking this claim.');
    sentMessage.edit({ embeds: [embed] });
  }
  botIdle();
}
