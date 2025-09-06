'use server';

import { suggestOptimalTaskTimes as suggestOptimalTaskTimesFlow, type SuggestOptimalTaskTimesInput, type SuggestOptimalTaskTimesOutput } from '@/ai/flows/suggest-optimal-task-times';

export async function suggestOptimalTaskTimes(input: SuggestOptimalTaskTimesInput): Promise<SuggestOptimalTaskTimesOutput> {
  try {
    const result = await suggestOptimalTaskTimesFlow(input);
    return result;
  } catch (error) {
    console.error('Error suggesting optimal task times:', error);
    throw new Error('Failed to get suggestion from AI.');
  }
}
