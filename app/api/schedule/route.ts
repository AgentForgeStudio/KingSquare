import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const scheduleSchema = z.object({
  type: z.string(),
  name: z.string(),
  phone: z.string().min(10),
  email: z.string().email(),
  notes: z.string().optional(),
  date: z.string(),
  time: z.string(),
  source: z.string(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = scheduleSchema.parse(body);

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_SCHEDULE_ENDPOINT;

    if (!formspreeId) {
      console.warn('Schedule Formspree endpoint not configured');
      return NextResponse.json({ success: true });
    }

    const ownerMessage = `A new meeting has been scheduled. 
Client: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Date: ${data.date}
Time: ${data.time}
Notes: ${data.notes || 'None'}
Please confirm and add to your calendar.`;

    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `NEW MEETING BOOKED — ${data.name} on ${data.date} at ${data.time}`,
        _replyto: data.email,
        type: data.type,
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes,
        date: data.date,
        time: data.time,
        source: data.source,
        timestamp: data.timestamp,
        ownerMessage,
      }),
    });

    if (!formspreeResponse.ok) {
      throw new Error('Formspree submission failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}
