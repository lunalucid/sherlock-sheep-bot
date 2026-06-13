import { Client } from 'discord.js';
import { intents } from './config/intents';
import { bindBot } from './builders/activity';
import { configuration } from './config';

export interface BotConfig {
  discordToken: string;
  openaiKey: string;
  guildId?: string;
  clientId?: string;
}

export type EmitLevel = 'info' | 'success' | 'warn' | 'error';
export type EmitFn = (event: string, data: unknown) => void;

// Helper to send logs from the bot to the UI
let _emit: EmitFn = () => { };
export const log = (level: EmitLevel, message: string) =>
  _emit('log', { level, message });

let client: Client | null = null;

export async function start(config: BotConfig, emit: EmitFn): Promise<void> {
  if (client) throw new Error('Bot is already running.');

  // Store emit so helpers can use it throughout your bot
  _emit = emit;

  configuration.DISCORD_BOT_TOKEN = config.discordToken;
  configuration.OPENAI_API_KEY = config.openaiKey;

  client = new Client({
    intents: intents,
  });
  bindBot(client);

  try {
    const event = await import('./events');
    event.ready({ bot: client, emit });
    event.guildCreate({ bot: client });
    event.messageCreate({ bot: client });
    event.interactionCreate({ bot: client });
    event.typingStart({ bot: client });

    await client.login(config.discordToken);
  } catch (error) {
    client = null;
    _emit = () => { };
    throw error;
  }

  process.on('SIGINT', () => {
    console.log('Interrupted. Exiting cleanly.');
    process.exit();
  });
}

export async function stop(): Promise<void> {
  if (!client) return;
  try {
    await client.destroy();
    log('info', 'Bot disconnected.');
    emit('stopped', null);
  } finally {
    client = null;
    _emit = () => { };
  }
}

// Internal helper so stop() can call emit after _emit may be cleared
function emit(event: string, data: unknown) {
  _emit(event, data);
}
