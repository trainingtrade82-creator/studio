'use server';

/**
 * @fileOverview An AI agent that suggests optimal times for tasks based on available time slots, task durations, and user preferences.
 *
 * - suggestOptimalTaskTimes - A function that suggests optimal times for tasks.
 * - SuggestOptimalTaskTimesInput - The input type for the suggestOptimalTaskTimes function.
 * - SuggestOptimalTaskTimesOutput - The return type for the suggestOptimalTaskTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTaskTimesInputSchema = z.object({
  taskName: z.string().describe('The name of the task to schedule.'),
  taskDuration: z.string().describe('The estimated duration of the task (e.g., "30 minutes", "1 hour", "2 hours 30 minutes").'),
  availableTimeSlots: z.string().describe('The available time slots for the day (e.g., "9:00 AM - 12:00 PM, 1:00 PM - 5:00 PM").'),
  userPreferences: z.string().describe('Any user preferences or priorities for scheduling the task (e.g., "schedule it in the morning", "avoid scheduling it during lunch time").'),
});

export type SuggestOptimalTaskTimesInput = z.infer<typeof SuggestOptimalTaskTimesInputSchema>;

const SuggestOptimalTaskTimesOutputSchema = z.object({
  suggestedTime: z.string().describe('The suggested optimal time for the task (e.g., "9:30 AM - 10:00 AM").'),
  reasoning: z.string().describe('The reasoning behind the suggested time, considering available time slots, task duration, and user preferences.'),
});

export type SuggestOptimalTaskTimesOutput = z.infer<typeof SuggestOptimalTaskTimesOutputSchema>;

export async function suggestOptimalTaskTimes(input: SuggestOptimalTaskTimesInput): Promise<SuggestOptimalTaskTimesOutput> {
  return suggestOptimalTaskTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalTaskTimesPrompt',
  input: {schema: SuggestOptimalTaskTimesInputSchema},
  output: {schema: SuggestOptimalTaskTimesOutputSchema},
  prompt: `You are a personal scheduling assistant. Your goal is to suggest the optimal time for a given task, taking into account the available time slots, the task's duration, and the user's preferences.

Task Name: {{{taskName}}}
Task Duration: {{{taskDuration}}}
Available Time Slots: {{{availableTimeSlots}}}
User Preferences: {{{userPreferences}}}

Consider these factors and suggest the best time for the task. Provide a brief explanation of your reasoning.

Suggested Time: 
Reasoning: `,
});

const suggestOptimalTaskTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTaskTimesFlow',
    inputSchema: SuggestOptimalTaskTimesInputSchema,
    outputSchema: SuggestOptimalTaskTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
