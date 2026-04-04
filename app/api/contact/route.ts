import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveFormspreeEndpoint } from '@/lib/formspree';

const contactSchema = z.object({
  name: z.string(),
  phone: z.string().min(10),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  source: z.string(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const formspreeId = resolveFormspreeEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT);

    if (!formspreeId) {
      console.warn('Contact Formspree endpoint not configured');
      return NextResponse.json({ success: true });
    }

    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `Direct Message from ${data.name} - ${data.subject}`,
        _replyto: data.email,
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        source: data.source,
        timestamp: data.timestamp,
      }),
    });

    if (!formspreeResponse.ok) {
      throw new Error('Formspree submission failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
