import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false,
    });
  }
  return openaiClient;
}

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function createChatCompletion(
  messages: ChatMessage[],
  context?: {
    propertySlug?: string;
    propertyTitle?: string;
    currentPage?: string;
  }
): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    return 'AI service is not configured. Please add your OPENAI_API_KEY to the environment variables.';
  }

  const systemPrompt = `You are KingSquare AI, a premium real estate assistant for KingSquare.
Help clients find luxury properties, understand market trends, schedule viewings, answer questions about neighborhoods, pricing, mortgages, and the buying process.
Be concise, professional, and warm. No markdown. Use line breaks only.
When user wants human agent → suggest voice call option.
IMPORTANT PHONE COLLECTION STRATEGY: After 3 exchanges, naturally ask:
'I can send you personalised property matches on WhatsApp — mind sharing your number?'
When user wants to schedule a meeting → trigger schedule modal.`;

  let fullSystemPrompt = systemPrompt;
  if (context?.propertyTitle) {
    fullSystemPrompt += `\n\nCurrent property being discussed: ${context.propertyTitle}`;
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: fullSystemPrompt },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';
}

export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  context?: {
    propertySlug?: string;
    propertyTitle?: string;
    currentPage?: string;
  }
): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    const fallbackMessage = 'AI service is not configured. Please add your OPENAI_API_KEY to the environment variables.';
    onChunk(fallbackMessage);
    return fallbackMessage;
  }

  const systemPrompt = `You are KingSquare AI, a premium real estate assistant for KingSquare.
Help clients find luxury properties, understand market trends, schedule viewings, answer questions about neighborhoods, pricing, mortgages, and the buying process.
Be concise, professional, and warm. No markdown. Use line breaks only.
When user wants human agent → suggest voice call option.
IMPORTANT PHONE COLLECTION STRATEGY: After 3 exchanges, naturally ask:
'I can send you personalised property matches on WhatsApp — mind sharing your number?'
When user wants to schedule a meeting → trigger schedule modal.`;

  let fullSystemPrompt = systemPrompt;
  if (context?.propertyTitle) {
    fullSystemPrompt += `\n\nCurrent property being discussed: ${context.propertyTitle}`;
  }

  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: fullSystemPrompt },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
    stream: true,
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      fullResponse += content;
      onChunk(content);
    }
  }

  return fullResponse;
}

