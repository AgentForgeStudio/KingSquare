import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const phoneCaptureSchema = z.object({
  phone: z.string().min(10).max(15),
  source: z.string(),
  pageUrl: z.string().optional(),
  timestamp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = phoneCaptureSchema.parse(body);

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_PHONE_ENDPOINT;

    if (!formspreeId) {
      console.warn('Phone capture Formspree endpoint not configured');
      return NextResponse.json({ success: true });
    }

    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `🔥 NEW LEAD — Phone Captured via ${data.source}`,
        phone: data.phone,
        source: data.source,
        pageUrl: data.pageUrl || 'Direct',
        timestamp: data.timestamp || new Date().toISOString(),
        ownerNote: `ACTION REQUIRED: Call this number ASAP. Captured from ${data.source}.`,
      }),
    });

    if (!formspreeResponse.ok) {
      throw new Error('Formspree submission failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Phone capture error:', error);
    return NextResponse.json(
      { error: 'Failed to capture phone number' },
      { status: 500 }
    );
  }
}
