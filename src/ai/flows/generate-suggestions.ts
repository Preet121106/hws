// src/ai/flows/generate-suggestions.ts
'use server';
/**
 * @fileOverview A flow that generates personalized suggestions based on user input and sentiment.
 *
 * - generateSuggestions - A function that generates suggestions for the user.
 * - GenerateSuggestionsInput - The input type for the generateSuggestions function.
 * - GenerateSuggestionsOutput - The return type for the generateSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSuggestionsInputSchema = z.object({
  userInput: z.string().describe('The user input text.'),
  sentiment: z.string().describe('The sentiment of the user input (e.g., positive, negative, neutral).'),
});
export type GenerateSuggestionsInput = z.infer<typeof GenerateSuggestionsInputSchema>;

const SuggestionSchema = z.object({
  title: z.string().describe('The title of the suggestion.'),
  description: z.string().describe('A detailed description of the suggestion.'),
  relevanceScore: z.number().describe('A score indicating how relevant the suggestion is to the user input (0-1).'),
});

const GenerateSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('An array of personalized suggestions for the user.'),
});
export type GenerateSuggestionsOutput = z.infer<typeof GenerateSuggestionsOutputSchema>;

export async function generateSuggestions(input: GenerateSuggestionsInput): Promise<GenerateSuggestionsOutput> {
  return generateSuggestionsFlow(input);
}

const generateSuggestionsPrompt = ai.definePrompt({
  name: 'generateSuggestionsPrompt',
  input: {
    schema: z.object({
      userInput: z.string().describe('The user input text.'),
      sentiment: z.string().describe('The sentiment of the user input.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z.array(SuggestionSchema).describe('An array of personalized suggestions for the user, ranked by relevanceScore.'),
    }),
  },
  prompt: `You are a helpful chatbot assistant that provides personalized suggestions to users based on their input and detected sentiment.\n\nUser Input: {{{userInput}}}\nSentiment: {{{sentiment}}}\n\nBased on the user input and sentiment, generate a list of suggestions that can help the user address their issue. Each suggestion should have a title, a detailed description, and a relevance score (0-1) indicating how relevant the suggestion is to the user input. Return the suggestions ranked by relevanceScore, with the most relevant suggestions first.\n\nFormat your response as a JSON object with a 'suggestions' field containing an array of suggestions.\n`, // Ensure that Handlebars syntax is used here
});

const generateSuggestionsFlow = ai.defineFlow<
  typeof GenerateSuggestionsInputSchema,
  typeof GenerateSuggestionsOutputSchema
>({
  name: 'generateSuggestionsFlow',
  inputSchema: GenerateSuggestionsInputSchema,
  outputSchema: GenerateSuggestionsOutputSchema,
},
async input => {
  const {output} = await generateSuggestionsPrompt(input);
  return output!;
});
