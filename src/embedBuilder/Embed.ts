import { APIEmbedField, APIThumbnailComponent, ComponentType, APIEmbedImage, APIMessageComponentEmoji, APIEmbedFooter, APIEmbedAuthor } from 'discord.js';

const Field = (name: string, value: string, inline = false): APIEmbedField => {
  return {
    name,
    value,
    inline,
  };
}
const Thumbnail = (url: string, description?: string, spoiler?: boolean): APIThumbnailComponent => {
  return {
    description,
    spoiler,
    type: ComponentType.Thumbnail,
    media: { url },
  }
}

const Image = (url: string, height?: number, width?: number): APIEmbedImage => {
  return {
    url,
    height,
    width,
  }
}

const Emoji = (name: string, id?: string, animated?: boolean): APIMessageComponentEmoji => {
  return {
    name,
    id,
    animated: animated || false,
  }
}

const Footer = (text: string, iconUrl?: string): APIEmbedFooter => {
  return {
    text,
    icon_url: iconUrl,
  }
}

const Author = (name: string, url?: string, iconUrl?: string): APIEmbedAuthor => {
  return {
    name,
    url,
    icon_url: iconUrl,
  }
}

export const Embed = { Field, Thumbnail, Image, Emoji, Footer, Author };