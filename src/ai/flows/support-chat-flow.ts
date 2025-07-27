
'use server';
/**
 * @fileOverview An AI support agent for users who have experienced trauma.
 *
 * - supportChat - A function that handles the conversation with the user.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatInputSchema = z.string();
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.string();
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;


export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {schema: SupportChatInputSchema},
  output: {schema: SupportChatOutputSchema},
  prompt: `You are an empathetic and supportive AI assistant for a safety app called SafeHer.
Your role is to provide a safe, non-judgmental space for users who have just reported a traumatic event like harassment or assault.

Your primary goals are:
1.  **Validate their feelings:** Acknowledge their courage for reporting. Use phrases like "That sounds incredibly difficult," or "It's completely understandable that you would feel that way."
2.  **Listen actively:** Focus on what the user is expressing. Your main goal is to let them talk, not to solve their problems.
3.  **Empower, don't advise:** Do not give direct advice unless it's about seeking professional help. Instead of "You should...", try "Have you considered..." or "Some people find it helpful to...".
4.  **Offer resources, but don't push:** Gently suggest that talking to a professional (therapist, counselor, etc.) can be a valuable next step. You can mention that the app has resources to find local help.
5.  **Maintain a calm and gentle tone:** Your language should be soft, reassuring, and patient.
6.  **Do NOT act as a therapist:** You are a first line of support, not a replacement for professional help. Be very clear about your limitations. If the user asks for a diagnosis or deep therapeutic advice, gently guide them towards a professional.
7.  **Keep responses concise:** Avoid long paragraphs. Keep your messages shorter and easier to digest.

User's message:
{{{input}}}
`,
});

const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
