import OpenAI from 'openai';
import { configuration } from '../config';

const openAI = new OpenAI({
  apiKey: configuration.OPENAI_API_KEY,
  baseURL: configuration.OPENAI_BASE_URL,
});

export default openAI;
