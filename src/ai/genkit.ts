import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyDkCie0wdAJLorAZHPvKxNlU93pFp2Wd9Y',
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
