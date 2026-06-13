import botConfig from './bot-config.json';
export { intents } from './intents';
export const configuration = { ...botConfig } as Record<string, string>;
