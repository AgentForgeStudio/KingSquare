import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const enquirySchema = z.object({
  type: z.string(),
  enquiryType: z.string(),
  propertyTypes: z.string(),
  budgetMin: z.number(),
  budgetMax: z.number(),
  location: z.string(),
  name: z.string(),
  phone: z.string().min(10),
  email: z.string().email(),
  message: z.string().optional(),
  source: z.string(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = enquirySchema.parse(body);

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ENQUIRY_ENDPOINT;

    if (!formspreeId) {
      console.warn('Enquiry Formspree endpoint not configured');
      return NextResponse.json({ success: true });
    }

    const ownerNote = `ACTION REQUIRED: New property enquiry received. Call ${data.name} at ${data.phone} within 24 hours.`;

    const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `🏠 NEW ENQUIRY — ${data.enquiryType} | Budget: ₹${data.budgetMin / 100000}L – ₹${data.budgetMax / 100000}L | ${data.name}`,
        _replyto: data.email,
        type: data.type,
        enquiryType: data.enquiryType,
        propertyTypes: data.propertyTypes,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        location: data.location,
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        source: data.source,
        timestamp: data.timestamp,
        ownerNote,
      }),
    });

    if (!formspreeResponse.ok) {
      throw new Error('Formspree submission failed');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
