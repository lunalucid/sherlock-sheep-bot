import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { factCheckResponseSchema } from '../ai/factCheckResponseSchema';
import { instructions as factCheckInstructions } from '../ai/process/factCheck'
import { instructions as observerInstructions } from '../ai/process/observe';
import { configuration } from '../config';
import openAI from '../ai/openAI';

const missingInstructions = `(couldn't retrieve instructions)`;

const getModel = async (name: string) => {
  if (!name) return 'model name missing';
  const modelInfo = await openAI.models.retrieve(name);
  if (modelInfo) {
    return `${ modelInfo.object } ${ modelInfo.id } | owned by ${ modelInfo.owned_by }, created ${ new Date(modelInfo.created * 1000).toLocaleString() }`;
  }
  return `couldn't retrieve model info for ${ name }`;
}

const processDescription = async () => {
  const [
    moderationModel,
    moderationReviewModel,
    observerModel,
    factCheckModel,
  ] = await Promise.all([
    getModel(configuration.MODERATION_MODEL || ''),
    getModel(configuration.MODERATION_REVIEW_MODEL || configuration.REVIEW_MODERATION_MODEL || ''),
    getModel(configuration.OBSERVER_MODEL || ''),
    getModel(configuration.FACT_CHECK_MODEL || ''),
  ]);

  const moderationReviewInstructions = configuration.MODERATION_REVIEW_INSTRUCTIONS || missingInstructions;

  const schemaShape = factCheckResponseSchema.shape as Record<string, { description?: string }>;

  const schemaDefinition = Object.keys(schemaShape)
    .map((key) => {
      const field = schemaShape[key];
      return `${ key }: ${ field?.description || '(no description)' }`;
    })
    .join('\n');

  return [`
Here is a description of the fact-checking flow and configuration/prompts involved.

### The fact-checking process when invoked automatically

- All non-bot server messages in channels the bot has access to are forwarded to moderation AI model (${ moderationModel }) and the response is forwarded to a moderation review AI model (${ moderationReviewModel }) with the following instructions:
\`\`\`
${ moderationReviewInstructions }
\`\`\`
`,
  `
- The messages not blocked by the moderation protocol are forwarded to a lightweight "observer" AI model (${ observerModel }) following explicit instructions to categorize the message accordingly. The model responds with the appropriate category which is then referenced in the next step.

The following is the current literal system message sent to the AI model with every message passed to it in regards to the categories:
\`\`\`
${ observerInstructions }
\`\`\`
`,
  `
- Messages marked as irrelevant end the process here. Messages passed on to be fact-checked are then forwarded to moderation AI model (${ moderationModel }) and the response is forwarded to a moderation review AI model (${ moderationReviewModel }) with the following instructions:
\`\`\`
${ moderationReviewInstructions }
\`\`\`

- Messages marked to be fact-checked are forwarded to an AI agent (${ factCheckModel }) with the following instructions:
\`\`\`
${ factCheckInstructions }
\`\`\`
`,
  `* The final output is formatted according to a custom defined schema and sent back to the chat:

\`factCheckResponseSchema\`
\`\`\`
${ schemaDefinition || "couldn't retrieve schema definition" }
\`\`\`

### The fact-checking process when invoked via slash command

- The same as above excluding the observer model step.
`]
}

export const data = new SlashCommandBuilder()
  .setName("transparency")
  .setDescription("Returns fact-checking process and bot configuration for transparency.")

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  console.log(`Transparency command invoked by ${ interaction.user.username } (${ interaction.user.id })`);

  await interaction.deferReply();
  const descriptionChunks = await processDescription();

  //const chunks = description.match(/[\s\S]{1,2000}/g) || [];

  /*if (chunks.length === 0) {
    await interaction.editReply({ content: 'Transparency details unavailable.' });
    return;
  }

  await interaction.editReply({ content: chunks[0] });

  for (const chunk of chunks.slice(1)) {
    await interaction.followUp({ content: chunk });
  }*/

  // Decided to create the chunks manually to avoid breaks in formatting
  if (!descriptionChunks || descriptionChunks.length === 0) {
    await interaction.editReply({ content: 'Transparency details unavailable.' });
    return;
  }
  const quoteBlock = `>>> `;
  const title = (num: number) => `## Transparency (Part ${ num })\n`;
  await interaction.editReply({ content: quoteBlock + title(1) + descriptionChunks[0] });

  for (const [index, chunk] of descriptionChunks.slice(1).entries()) {
    await interaction.followUp({ content: quoteBlock + title(index + 2) + chunk })
  }
}
