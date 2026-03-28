import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/lib/openai';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  context: z
    .object({
      propertySlug: z.string().optional(),
      propertyTitle: z.string().optional(),
      currentPage: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = chatSchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const response = await createChatCompletion(messages, context);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
