import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set. AI features will be disabled.');
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Generate embedding for a text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Please set OPENAI_API_KEY.');
  }

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Generate explanation for why a template matches a query
 */
export async function generateMatchExplanation(
  query: string,
  templateTitle: string,
  templateDescription: string
): Promise<string> {
  if (!openai) {
    return `This template matches your request: ${templateTitle}`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that explains why design templates match user requests. Keep explanations concise (1-2 sentences).',
        },
        {
          role: 'user',
          content: `User query: "${query}"\n\nTemplate: "${templateTitle}"\nDescription: "${templateDescription}"\n\nExplain why this template matches the user's request.`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'This template matches your request.';
  } catch (error) {
    console.error('Error generating match explanation:', error);
    return `This template matches your request: ${templateTitle}`;
  }
}
