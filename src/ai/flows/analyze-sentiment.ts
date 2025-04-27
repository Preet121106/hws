'use server';
/**
 * @fileOverview A sentiment analysis AI agent.
 *
 * - analyzeSentiment - A function that handles the sentiment analysis process.
 * - AnalyzeSentimentInput - The input type for the analyzeSentiment function.
 * - AnalyzeSentimentOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeSentimentInputSchema = z.object({
  text: z.string().describe('The text to analyze for sentiment.'),
});
export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;

const AnalyzeSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the text.'),
  score: z.number().describe('A numerical score representing the sentiment.'),
  reason: z.string().describe('The reason for the identified sentiment.'),
});
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export async function analyzeSentiment(input: AnalyzeSentimentInput): Promise<AnalyzeSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to analyze for sentiment.'),
    }),
  },
  output: {
    schema: z.object({
      sentiment: z
        .enum(['positive', 'negative', 'neutral'])
        .describe('The sentiment of the text.'),
      score: z.number().describe('A numerical score representing the sentiment.'),
      reason: z.string().describe('The reason for the identified sentiment.'),
    }),
  },
  prompt: `Analyze the sentiment of the following text and provide a sentiment, a score, and a reason for the sentiment.

Text: {{{text}}}

Sentiment (positive, negative, or neutral):
Score (a numerical value between -1 and 1):
Reason:`,
});

const analyzeSentimentFlow = ai.defineFlow<
  typeof AnalyzeSentimentInputSchema,
  typeof AnalyzeSentimentOutputSchema
>({
  name: 'analyzeSentimentFlow',
  inputSchema: AnalyzeSentimentInputSchema,
  outputSchema: AnalyzeSentimentOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
