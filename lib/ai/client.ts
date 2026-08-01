import { createGoogleGenerativeAI } from '@ai-sdk/google';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY environment variable is not set.');
}

export const google = createGoogleGenerativeAI({
  apiKey: apiKey || '',
});

export const DEFAULT_MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
export const defaultModel = google(DEFAULT_MODEL_NAME);
