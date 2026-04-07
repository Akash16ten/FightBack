// Get the Groq API key from environment variables
// Set VITE_GROQ_API_KEY in your .env file — never hardcode API keys!
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroq(messages: GroqMessage[], maxTokens = 1024): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY is not set. Please add it to your .env file.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}