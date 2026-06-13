import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { process } from '../ai/process';

export const data = new SlashCommandBuilder()
  .setName('fact_check')
  .setDescription('Fact check a claim')
  .addStringOption(option =>
    option.setName('claim')
      .setDescription('The claim to fact check')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  console.log(`Fact check command invoked by ${ interaction.user.tag } (${ interaction.user.id })`);
  const claim = interaction.options.getString('claim', true);
  console.log(`Claim to fact check: '${ claim }'`);
  await interaction.deferReply();
  await interaction.editReply({ content: `> ${ claim } \n🤔` });
  await process({ interaction, followUp: true });
  await interaction.editReply({ content: `Checked the facts for the claim: '${ claim }'` });
}
