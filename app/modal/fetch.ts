'use server';
import OpenAI from 'openai';

export async function fetchRecommendation() {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const UVIndex = 30;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
            Act as a weather speccialist, give a bullet point list for the impact summary of the given weather condition and actions to reponse to that weather condition.

            Weather condition:
            - UV Index: ${UVIndex}
            `,
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0];
}
