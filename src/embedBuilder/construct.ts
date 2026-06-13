import {
  ThumbnailBuilder,
  EmbedBuilder,
  APIEmbedField,
  APIEmbedFooter,
  APIEmbedAuthor,
  APIThumbnailComponent,
} from 'discord.js';

export const createEmbed = (
  title?: string,
  description?: string,
  fields: APIEmbedField[] = [],
  thumbnail?: APIThumbnailComponent,
  image?: string,
  footer?: APIEmbedFooter,
  author?: APIEmbedAuthor,
): EmbedBuilder => {
  const embed = new EmbedBuilder()
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (image) embed.setImage(image);
  if (thumbnail) {
    new ThumbnailBuilder(thumbnail)
  }
  if (fields.length > 0) embed.addFields(fields);
  if (footer) embed.setFooter(footer);
  if (author) embed.setAuthor(author);

  return embed;
}
